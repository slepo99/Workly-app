<template>
  <div class="overflow-hidden rounded-lg border border-default">
    <div class="border-b border-default px-4 py-3">
      <span class="text-lg font-semibold"> Tasks list </span>
    </div>

    <UTable
      v-model:sorting="sorting"
      sticky
      :data="tasks"
      :columns="columns"
      :ui="{
        root: 'max-h-[500px] overflow-y-auto scrollbar-thin border border-default rounded-b-lg',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Column } from "@tanstack/vue-table";
import { formatDate } from "~/utils/date";
import { useStatuses } from "~/composables/useStatuses";
import type { TaskStatus } from "~/constants/taskStatuses";
interface TaskAssigneeModel {
  id: string;
  name: string;
  avatar: string | null;
}

interface ProjectTaskModel {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  assignees: TaskAssigneeModel[];
}

defineProps<{
  tasks: ProjectTaskModel[];
}>();

const emit = defineEmits<{
  "update-status": [taskId: string, status: TaskStatus];
  open: [taskId: string];
  editTask: [taskId: string];
  delete: [taskId: string];
}>();
const { getTaskStatuses, getTaskStatusColors } = useStatuses();
const USelect = resolveComponent("USelect");
const UAvatarGroup = resolveComponent("UAvatarGroup");
const UAvatar = resolveComponent("UAvatar");
const UButton = resolveComponent("UButton");

const sorting = ref([]);

const columns: TableColumn<ProjectTaskModel>[] = [
  {
    accessorKey: "id",

    header: ({ column }) => getHeader(column, "ID"),

    cell: ({ row }) =>
      h(
        "div",
        {
          class: "max-w-32 truncate text-muted",
          title: row.original.id,
        },
        `#${row.original.id}`,
      ),
  },

  {
    accessorKey: "title",

    header: ({ column }) => getHeader(column, "Task Name"),

    cell: ({ row }) =>
      h(
        "div",
        {
          class: "max-w-48 truncate",
          title: row.original.title,
        },
        row.original.title,
      ),
  },

  {
    accessorKey: "status",

    header: ({ column }) => getHeader(column, "Status"),

    cell: ({ row }) => {
      const status = row.original.status;

      return h(USelect, {
        modelValue: status,
        items: getTaskStatuses.value,
        valueKey: "value",
        labelKey: "label",
        size: "sm",
        color: "neutral",
        class: "w-36",

        ui: {
          base: `rounded-full ${getTaskStatusColors(status) ?? ""} outline-none ring-0`,
        },

        "onUpdate:modelValue": (value: string) => {
          emit("update-status", row.original.id, value as TaskStatus);
        },
      });
    },
  },

  {
    accessorKey: "startDate",

    header: ({ column }) => getHeader(column, "Start Date"),

    cell: ({ row }) => {
      const startDate = row.original.startDate;

      return startDate ? formatDate(startDate) : "—";
    },
  },

  {
    accessorKey: "endDate",

    header: ({ column }) => getHeader(column, "End Date"),

    cell: ({ row }) => {
      const endDate = row.original.endDate;

      return endDate ? formatDate(endDate) : "—";
    },
  },

  {
    accessorKey: "assignees",
    header: "Assigned to",

    cell: ({ row }) => {
      const assignees = row.original.assignees;

      if (!assignees.length) {
        return h("span", { class: "text-muted" }, "—");
      }

      const groupKey = JSON.stringify([
        row.original.id,
        assignees.map((user) => [user.id, user.name, user.avatar]),
      ]);

      return h(
        UAvatarGroup,
        {
          key: groupKey,
          max: 3,
        },
        {
          default: () =>
            assignees.map((user) =>
              h(UAvatar, {
                key: user.id,
                alt: user.name,
                src: user.avatar ?? undefined,
              }),
            ),
        },
      );
    },
  },

  {
    accessorKey: "createdAt",

    header: ({ column }) => getHeader(column, "Created At"),

    cell: ({ row }) => formatDate(row.original.createdAt),
  },

  {
    id: "actions",
    header: "Actions",
    enableSorting: false,

    cell: ({ row }) =>
      h(
        "div",
        {
          class: "flex items-center gap-1",
        },
        [
          h(UButton, {
            icon: "i-lucide-edit",
            color: "neutral",
            variant: "ghost",
            size: "sm",

            onClick: () => {
              emit("editTask", row.original.id);
            },
          }),
          h(UButton, {
            icon: "i-lucide-eye",
            color: "neutral",
            variant: "ghost",
            size: "sm",

            onClick: () => {
              emit("open", row.original.id);
            },
          }),

          h(UButton, {
            icon: "i-lucide-trash-2",
            color: "error",
            variant: "ghost",
            size: "sm",

            onClick: () => {
              emit("delete", row.original.id);
            },
          }),
        ],
      ),
  },
];

function getHeader(column: Column<ProjectTaskModel>, label: string) {
  return h(UButton, {
    color: "neutral",
    variant: "ghost",
    label,

    icon: column.getIsSorted()
      ? column.getIsSorted() === "asc"
        ? "i-lucide-arrow-up"
        : "i-lucide-arrow-down"
      : "i-lucide-arrow-up-down",

    onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
  });
}
</script>
