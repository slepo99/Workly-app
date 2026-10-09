<template>
  <div class="min-w-0 overflow-hidden rounded-lg border border-default">
    <div
      class="border-b border-default px-4 py-3 flex items-center justify-between"
    >
      <span class="text-lg font-semibold">Project members</span>
      <ProjectAddMembers :project-id="projectId" />
    </div>

    <UTable
      v-model:sorting="sorting"
      sticky
      :data="members"
      :columns="columns"
      :ui="{
        root: 'max-h-[500px] overflow-auto scrollbar-thin',
      }"
    >
      <template #empty>
        <div class="py-6 text-center text-muted">No project members</div>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import { h, ref, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Column, SortingState } from "@tanstack/vue-table";
import { formatDate } from "~/utils/date";
import type { ProjectMemberModel } from "~/composables/api/useProjectMembersApi/types";
import { PROJECT_ROLES } from "~/constants/projectRoles";
defineProps<{
  members: ProjectMemberModel[];
  projectId: string;
}>();

const UAvatar = resolveComponent("UAvatar");
const UButton = resolveComponent("UButton");
const UTooltip = resolveComponent("UTooltip");
const USelect = resolveComponent("USelect");

const emit = defineEmits<{
  "update-role": [
    payload: {
      projectId: string;
      userId: string;
      role: string;
    },
  ];
  view: [memberId: string];
  remove: [memberId: string];
}>();

const sorting = ref<SortingState>([]);
const roleItems = [
  {
    label: "Analyst",
    value: PROJECT_ROLES.ANALYST,
  },
  {
    label: "Designer",
    value: PROJECT_ROLES.DESIGNER,
  },
  {
    label: "Developer",
    value: PROJECT_ROLES.DEVELOPER,
  },
  {
    label: "Manager",
    value: PROJECT_ROLES.MANAGER,
  },
  {
    label: "Tester",
    value: PROJECT_ROLES.TESTER,
  },
];

const columns: TableColumn<ProjectMemberModel>[] = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    enableSorting: false,
    cell: ({ row }) => {
      const member = row.original;

      if (!member.user.avatar) {
        return h("div", {
          class:
            "size-10 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-700",
          role: "img",
          "aria-label": `No avatar for ${member.user.name}`,
        });
      }

      return h(UAvatar, {
        src: member.user.avatar,
        alt: member.user.name,
        class: "size-10 shrink-0",
      });
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => getHeader(column, "Name"),
    cell: ({ row }) =>
      h(
        "div",
        {
          class: "max-w-48 truncate font-medium",
          title: row.original.user.name,
        },
        row.original.user.name,
      ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => getHeader(column, "Email"),
    cell: ({ row }) =>
      h(
        "a",
        {
          href: `mailto:${row.original.user.email}`,
          class: "block max-w-60 truncate text-primary hover:underline",
          title: row.original.user.email,
        },
        row.original.user.email,
      ),
  },
  {
    accessorKey: "position",
    header: ({ column }) => getHeader(column, "Position"),
    cell: ({ row }) =>
      h(
        "div",
        {
          class: "max-w-48 truncate",
          title: row.original.user.position || undefined,
        },
        row.original.user.position || "—",
      ),
  },
  {
    accessorKey: "role",

    header: ({ column }) => getHeader(column, "Role"),

    cell: ({ row }) => {
      const status = row.original.role;

      return h(USelect, {
        modelValue: status,
        items: roleItems,
        valueKey: "value",
        labelKey: "label",
        size: "sm",
        class: "w-36",

        ui: {
          base: `rounded-full`,
        },

        "onUpdate:modelValue": (value: string) => {
          emit("update-role", {
            projectId: row.original.projectId,
            userId: row.original.user.id,
            role: value,
          });
        },
      });
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => getHeader(column, "Joined at"),
    cell: ({ row }) => formatDate(row.original.user.createdAt),
  },
  {
    id: "id",
    accessorFn: (row) => row.user.id,
    header: ({ column }) => getHeader(column, "ID"),
    cell: ({ row }) =>
      h(
        UTooltip,
        { text: row.original.user.id },
        {
          default: () =>
            h(
              "div",
              { class: "max-w-32 truncate text-muted" },
              row.original.user.id,
            ),
        },
      ),
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) =>
      h("div", { class: "flex items-center gap-1" }, [
        h(UButton, {
          icon: "i-lucide-eye",
          color: "neutral",
          variant: "ghost",
          size: "sm",
          "aria-label": "View member",
          onClick: () => {
            console.log("Open member:", row.original.user.id);
          },
        }),

        h(UButton, {
          icon: "i-lucide-trash-2",
          color: "error",
          variant: "ghost",
          size: "sm",
          "aria-label": "Remove member",
          onClick: () => {
            emit("remove", row.original.id);
          },
        }),
      ]),
  },
];

function getHeader(column: Column<ProjectMemberModel>, label: string) {
  const isSorted = column.getIsSorted();

  return h(UButton, {
    color: "neutral",
    variant: "ghost",
    label,
    icon: isSorted
      ? isSorted === "asc"
        ? "i-lucide-arrow-up"
        : "i-lucide-arrow-down"
      : "i-lucide-arrow-up-down",
    class: "-mx-2.5",
    onClick: () => column.toggleSorting(isSorted === "asc"),
  });
}
</script>
