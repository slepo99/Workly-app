<template>
  <UCollapsible
    v-model:open="isOpen"
    class="overflow-hidden rounded-lg border border-default"
  >
    <div class="flex flex-col gap-3 bg-elevated p-3 sm:gap-4 sm:p-4">
      <div class="flex cursor-pointer items-center justify-between gap-3">
        <div class="flex min-w-0 items-center gap-3 sm:gap-4">
          <img
            v-if="groupedTasks.image"
            :src="groupedTasks.image"
            alt="Workly"
            class="h-12 w-16 shrink-0 rounded object-cover sm:h-14 sm:w-20"
          />
          <!-- todo: move to no-image ui component -->
          <div
            v-else
            class="flex h-12 w-16 shrink-0 rounded object-cover sm:h-14 sm:w-20 items-center justify-center rounded-xl border border-dashed border-neutral-300 text-muted dark:border-neutral-600"
          >
            <UIcon name="i-lucide-image" />
          </div>

          <div class="flex min-w-0 flex-col justify-center gap-1 sm:gap-2">
            <span class="truncate text-base font-bold sm:text-lg">
              {{ groupedTasks.name }}
            </span>

            <p class="whitespace-nowrap text-xs text-muted sm:text-sm">
              {{
                `${getTasksComletionRate(groupedTasks.tasks).completedTasks} of ${groupedTasks.tasks.length}`
              }}
            </p>
          </div>
        </div>

        <div class="flex shrink-0 items-center gap-2 sm:gap-4">
          <UProgress
      
            :model-value="getTasksComletionRate(groupedTasks.tasks).percent"
            :max="100"
            :color="
              getProgressColor(
                getTasksComletionRate(groupedTasks.tasks).percent,
              )
            "
            class="hidden w-50 sm:block"
          >
            <template #status="{ percent }">
              <div class="w-full">{{ percent }}% completed</div>
            </template>
          </UProgress>

          <UButton
            :icon="isOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            variant="ghost"
            color="neutral"
            aria-label="Toggle project tasks"
            class="shrink-0"
          />
        </div>
      </div>

      <UProgress
        
        :model-value="getTasksComletionRate(groupedTasks.tasks).percent"
        :max="100"
        :color="
          getProgressColor(getTasksComletionRate(groupedTasks.tasks).percent)
        "
        class="sm:hidden"
        size="sm"
      >
        <template #status="{ percent }">
          <div class="w-full text-xs">{{ percent }}% completed</div>
        </template>
      </UProgress>
    </div>

    <template #content>
      <div
        v-for="task in groupedTasks.tasks"
        :key="task.id"
        class="border-t border-default bg-default"
      >
        <div
          class="flex flex-col gap-3 border-b border-default p-3 transition-colors hover:bg-elevated sm:grid sm:grid-cols-12 sm:items-center sm:gap-4"
        >
          <div
            class="flex min-w-0 flex-col gap-3 sm:col-span-9 sm:grid sm:grid-cols-9 sm:items-center sm:gap-4"
          >
            <div
              class="flex min-w-0 items-center gap-3 sm:col-span-5 sm:grid sm:grid-cols-[7rem_minmax(0,1fr)]"
            >
              <UBadge
                class="w-fit shrink-0"
                :color="getTaskStatusBageColor(task.status)"
              >
                {{ getTaskStatusLabel(task.status) }}
              </UBadge>

              <span class="min-w-0 truncate">
                {{ task.title }}
              </span>
            </div>

            <div
              v-if="task.endDate"
              class="flex items-center justify-between gap-3 sm:col-span-4 sm:grid sm:grid-cols-[8rem_5.5rem] sm:justify-start"
            >
              <div
                class="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm text-muted"
              >
                <UIcon name="i-lucide-calendar-clock" />

                <span>
                  {{ formatDateShort(task.endDate) }}
                </span>
              </div>

              <UBadge
                class="w-fit shrink-0"
                :color="getTaskTermination(task.endDate).color"
              >
                {{ getTaskTermination(task.endDate).label }}
              </UBadge>
            </div>
          </div>

          <div
            class="flex items-center justify-between gap-3 sm:col-span-3 sm:grid sm:grid-cols-[minmax(0,1fr)_2.25rem] sm:justify-end"
          >
            <UAvatarGroup :max="3">
              <UAvatar
                v-for="assignee in task.assignees"
                :key="assignee.id"
                :src="assignee.avatar || undefined"
                :alt="assignee.name || 'Workly'"
              />
            </UAvatarGroup>

            <UButton
              icon="i-lucide-eye"
              color="neutral"
              variant="ghost"
              aria-label="View task"
              class="hover:bg-accented hover:text-primary"
            />
          </div>
        </div>
      </div>
    </template>
  </UCollapsible>
</template>

<script setup lang="ts">
import { useStatuses } from "~/composables/useStatuses";
import { useTasksProjectGroup } from "~/composables/components/tasks/useTasksProjectGroup";
import type { GroupedTasksProjectModel } from "~/composables/api/useTasksApi/types";

const { getTaskStatusLabel, getTaskTermination, getTaskStatusBageColor } =
  useStatuses();
const { getTasksComletionRate } = useTasksProjectGroup();


const props = defineProps<{
  groupedTasks: GroupedTasksProjectModel;
}>();

const isOpen = ref(false);
</script>
