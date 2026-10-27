<template>
  <div class="overflow-hidden rounded-lg border border-default">
    <div class="border-b border-default px-4 py-3">
      <span class="text-lg font-semibold">Projects list</span>
    </div>

    <UTable
      v-model:sorting="sorting"
      sticky
      :data="projects"
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
import type { ProjectModel } from "~/composables/api/useProjectsApi/types";

const props = defineProps<{
  projects: ProjectModel[];
}>();

const router = useRouter();

const { getProjectStatusColor, getProjectStatusLabel } = useStatuses();

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");

const sorting = ref([]);

const columns = computed<TableColumn<ProjectModel>[]>(() => {
  const result: TableColumn<ProjectModel>[] = [
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
      accessorKey: "image",
      header: "Image",

      cell: ({ row }) =>
        row.original.image
          ? h("img", {
              class: "h-6 w-8 shrink-0 rounded object-cover sm:h-8 sm:w-12",
              alt: row.original.name,
              src: row.original.image,
            })
          : h(
              "div",
              {
                // todo: move to reusable component
                class:
                  "flex h-6 w-8 shrink-0 items-center justify-center rounded border border-dashed border-neutral-300 text-muted dark:border-neutral-600 sm:h-8 sm:w-12",
              },
              [
                h(resolveComponent("UIcon"), {
                  name: "i-lucide-image",
                  class: "size-4 sm:size-5",
                }),
              ],
            ),
    },

    {
      accessorKey: "name",

      header: ({ column }) => getHeader(column, "Project Name"),

      cell: ({ row }) =>
        h(
          "div",
          {
            class: "max-w-48 truncate",
            title: row.original.name,
          },
          row.original.name,
        ),
    },

    {
      accessorKey: "createdAt",

      header: ({ column }) => getHeader(column, "Created At"),

      cell: ({ row }) => formatDate(row.original.createdAt),
    },

    {
      accessorKey: "status",

      header: ({ column }) => getHeader(column, "Project status"),

      cell: ({ row }) =>
        h(
          UBadge,
          {
            color: getProjectStatusColor(row.original.status),
          },
          () => getProjectStatusLabel(row.original.status),
        ),
    },

    {
      id: "actions",
      header: "Actions",
      enableSorting: false,

      cell: ({ row }) => {
        const viewButton = h(UButton, {
          icon: "i-lucide-eye",
          color: "neutral",
          variant: "ghost",
          size: "sm",

          onClick: () => {
            navigateTo(`/projects/${row.original.id}`);
          },
        });
        return viewButton;
      },
    },
  ];

  return result;
});

function getHeader(column: Column<ProjectModel>, label: string) {
  return h(UButton, {
    color: "neutral",
    variant: "ghost",
    label,

    icon: column.getIsSorted()
      ? column.getIsSorted() === "asc"
        ? "i-lucide-arrow-up"
        : "i-lucide-arrow-down"
      : "i-lucide-arrow-up-down",

    onClick: () => {
      column.toggleSorting(column.getIsSorted() === "asc");
    },
  });
}
</script>
