<template>
  <div class="rounded-lg border border-default overflow-hidden">
    <div class="px-4 py-3 border-b border-default">
      <span class="text-lg font-semibold">Tasks list</span>
    </div>

    <UTable
  
      sticky
      :data="data"
      v-model:sorting="sorting"
      :columns="columns"
      :ui="{
        root: 'max-h-[500px] overflow-y-auto scrollbar-thin border border-default rounded-b-lg',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { formatDate } from "~/utils/date";
import type { Column } from "@tanstack/vue-table";
interface ProjectTableRow {
  id: string;
  taskName: string;
  projectName: string;
  status: "active" | "completed" | "on-hold";
  startDate: string;
  endDate: string | null;
  assignedUsers: string[];
  priority: "low" | "medium" | "high";
}
const statuses = ["active", "completed", "on-hold"] as const;
const priorities = ["low", "medium", "high"] as const;
const USelect = resolveComponent("USelect");
const UAvatarGroup = resolveComponent("UAvatarGroup");
const UAvatar = resolveComponent("UAvatar");
const UBadge = resolveComponent("UBadge");
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const users = [
  "John Smith",
  "Emma Wilson",
  "Michael Brown",
  "Olivia Davis",
  "Daniel Miller",
  "Sophia Taylor",
];

const statusItems = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Completed",
    value: "completed",
  },
  {
    label: "On hold",
    value: "on-hold",
  },
];
const sorting = ref([]);
const data = ref<ProjectTableRow[]>(
  Array(100)
    .fill(0)
    .map((_, i) => ({
      id: `PRJ-${String(i + 1).padStart(4, "0")}`,
      taskName: `Task ${i + 1}`,
      projectName: `Project ${i + 1}`,
      status: statuses[i % statuses.length]!,
      startDate: `2026-09-${String((i % 28) + 1).padStart(2, "0")}`,
      endDate: `2026-10-${String((i % 28) + 1).padStart(2, "0")}`,
      assignedUsers: [users[i % users.length]!, users[(i + 1) % users.length]!],
      priority: priorities[i % priorities.length]!,
    })),
);

const columns: TableColumn<ProjectTableRow>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => getHeader(column, "ID"),
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "taskName",
    header: ({ column }) => getHeader(column, "Task Name"),
    cell: ({ row }) =>
      h(
        "div",
        {
          class: "max-w-48 truncate",
          title: row.getValue("taskName") as string,
        },
        row.getValue("taskName") as string,
      ),
  },
  {
    accessorKey: "projectName",
    header: ({ column }) => getHeader(column, "Project Name"),
    cell: ({ row }) =>
      h(
        "div",
        {
          class: "max-w-40 truncate",
          title: row.getValue("projectName") as string,
        },
        row.getValue("projectName") as string,
      ),
  },

  {
    accessorKey: "status",
    header: ({ column }) => getHeader(column, "Status"),
    cell: ({ row }) => {
      const status = row.original.status;
      const statusClass = {
        active:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        completed:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        "on-hold":
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      }[status];
      return h(USelect, {
        modelValue: status,
        items: statusItems,
        valueKey: "value",
        labelKey: "label",
        size: "sm",
        color: "neutral",
        class: "w-32",
        ui: {
          base: `rounded-full ${statusClass} outline-none ring-0`,
        },

        "onUpdate:modelValue": (value: ProjectTableRow["status"]) => {
          row.original.status = value;
        },
      });
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => getHeader(column, "Start Date"),
    cell: ({ row }) => formatDate(row.getValue("startDate")),
  },
  {
    accessorKey: "endDate",
    header: ({ column }) =>
      h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "End Date",
        icon: column.getIsSorted()
          ? column.getIsSorted() === "asc"
            ? "i-lucide-arrow-up"
            : "i-lucide-arrow-down"
          : "i-lucide-arrow-up-down",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      }),
    cell: ({ row }) => formatDate(row.getValue("endDate")),
  },
  {
    accessorKey: "assignedUsers",
    header: "Assigned to",
    cell: ({ row }) => {
      const users = row.getValue("assignedUsers") as string[];

      return h(
        UAvatarGroup,
        {
          max: 3,
        },
        () =>
          users.map((user) =>
            h(UAvatar, {
              alt: user,
              src: "https://github.com/benjamincanac.png",
            }),
          ),
      );
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => getPriorityHeader(column, "Priority"),
    sortingFn: (rowA, rowB) => {
      const order = {
        low: 1,
        medium: 2,
        high: 3,
      } as const;

      return order[rowA.original.priority] - order[rowB.original.priority];
    },
    cell: ({ row }) => {
      const priority = row.getValue("priority");
      const colors = {
        low: "success",
        medium: "warning",
        high: "error",
      }[priority as string];
      return h(UBadge, {
        label: priority,
        color: colors,
      });
    },
  },
  {
  id: "actions",
  header: "Actions",
  enableSorting: false,
  cell: ({ row }) => {
    return h(
      "div",
      {
        class: "flex items-center gap-1",
      },
      [
        h(UButton, {
          icon: "i-lucide-eye",
          color: "neutral",
          variant: "ghost",
          size: "sm",
          onClick: () => {
            console.log("Open task:", row.original.id);
          },
        }),

        h(UButton, {
          icon: "i-lucide-trash-2",
          color: "error",
          variant: "ghost",
          size: "sm",
          onClick: () => {
            console.log("Delete task:", row.original.id);
          },
        }),
      ],
    );
  },
},
];

function getHeader(column: Column<ProjectTableRow>, label: string) {
  return h(UButton, {
    color: "neutral",
    variant: "ghost",
    label: label,
    icon: column.getIsSorted()
      ? column.getIsSorted() === "asc"
        ? "i-lucide-arrow-up"
        : "i-lucide-arrow-down"
      : "i-lucide-arrow-up-down",
    onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
  });
}
function getPriorityHeader(column: Column<ProjectTableRow>, label: string) {
  const isSorted = column.getIsSorted();

  return h(
    UDropdownMenu,
    {
      content: {
        align: "start",
      },
      "aria-label": "Actions dropdown",
      items: [
        {
          label: "Low → High",
          type: "checkbox",
          checked: isSorted === "asc",
          onSelect: () => {
            if (isSorted === "asc") {
              column.clearSorting();
            } else {
              column.toggleSorting(false);
            }
          },
        },
        {
          label: "High → Low",
          type: "checkbox",
          checked: isSorted === "desc",
          onSelect: () => {
            if (isSorted === "desc") {
              column.clearSorting();
            } else {
              column.toggleSorting(true);
            }
          },
        },
      ],
    },
    () =>
      h(UButton, {
        color: "neutral",
        variant: "ghost",
        label,
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5 data-[state=open]:bg-elevated",
      }),
  );
}
</script>

<style scoped></style>
