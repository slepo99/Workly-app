<template>
  <UTable
    v-model:sorting="sorting"
    :data="users"
    :columns="columns"
    class="flex-1"
  />
</template>

<script setup lang="ts">
import type { UserModel } from "~/composables/api/useUsersApi/types";
import type { TableColumn } from "@nuxt/ui";
import type { Column, SortingState } from "@tanstack/vue-table";
import { usePermissions } from "~/composables/usePermissions";
defineProps<{
  users: UserModel[];
}>();
const emit = defineEmits<{
  remove: [userId: string];
}>();

const { isAdmin } = usePermissions();
const sorting = ref<SortingState>([]);

const UAvatar = resolveComponent("UAvatar");
const UTooltip = resolveComponent("UTooltip");
const UButton = resolveComponent("UButton");

const columns: TableColumn<UserModel>[] = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    enableSorting: false,

    cell: ({ row }) => {
      const user = row.original;

      if (!user.avatar) {
        return h("div", {
          class:
            "size-10 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-700",
          role: "img",
          "aria-label": `No avatar for ${user.name}`,
        });
      }

      return h(UAvatar, {
        src: user.avatar,
        alt: user.name,
        class: "size-10 shrink-0",
      });
    },
  },
  {
    accessorKey: "name",

    accessorFn: (row) => row.name,

    header: ({ column }) => getHeader(column, "Name"),

    cell: ({ row }) =>
      h(
        "div",
        {
          class: "max-w-48 truncate font-medium",
          title: row.original.name,
        },
        row.original.name,
      ),
  },
  {
    accessorKey: "email",

    accessorFn: (row) => row.email,

    header: ({ column }) => getHeader(column, "Email"),

    cell: ({ row }) =>
      h(
        "a",
        {
          href: `mailto:${row.original.email}`,
          class: "block max-w-60 truncate text-primary hover:underline",
          title: row.original.email,
        },
        row.original.email,
      ),
  },
  {
    accessorKey: "position",

    accessorFn: (row) => row.position,

    header: ({ column }) => getHeader(column, "Position"),

    cell: ({ row }) =>
      h(
        "div",
        {
          class: "max-w-48 truncate",
          title: row.original.position || undefined,
        },
        row.original.position || "—",
      ),
  },
  {
    accessorKey: "role",

    header: ({ column }) => getHeader(column, "Role"),

    cell: ({ row }) => {
      const status = row.original.role;

      return h(
        "div",
        {
          class: "max-w-48 truncate",
          title: row.original.role || undefined,
        },
        row.original.role || "—",
      );
    },
  },
  {
    accessorKey: "createdAt",

    header: ({ column }) => getHeader(column, "Joined at"),

    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "id",

    accessorFn: (row) => row.id,

    header: ({ column }) => getHeader(column, "ID"),

    cell: ({ row }) =>
      h(
        UTooltip,
        { text: row.original.id },
        {
          default: () =>
            h(
              "div",
              { class: "max-w-32 truncate text-muted" },
              row.original.id,
            ),
        },
      ),
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,

    cell: ({ row }) => {
      const actions = [
        h(UButton, {
          icon: "i-lucide-eye",
          color: "neutral",
          variant: "ghost",
          size: "sm",
          "aria-label": "View user",

          onClick: () => {
            navigateTo(`/users/${row.original.id}`);
          },
        }),

        ...(isAdmin.value
          ? [
              h(UButton, {
                icon: "i-lucide-trash-2",
                color: "error",
                variant: "ghost",
                size: "sm",
                "aria-label": "Remove user",

                onClick: () => {
                  emit("remove", row.original.id);
                },
              }),
            ]
          : []),
      ];

      return h(
        "div",
        {
          class: "flex items-center gap-1",
        },
        actions,
      );
    },
  },
];

function getHeader(column: Column<UserModel>, label: string) {
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

<style scoped></style>
