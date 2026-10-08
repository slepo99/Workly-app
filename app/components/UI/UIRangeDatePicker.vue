<script setup lang="ts">
import {
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  type DateValue,
} from "@internationalized/date";
import type { DateRange } from "reka-ui";

import { DATE_LOCALES } from "~/constants/locale";

type DateRangeModel = {
  start: string;
  end: string;
};

const modelValue = defineModel<DateRangeModel>({
  required: true,
});

const { locale, t } = useI18n();

const dateLocale = computed(() => {
  return DATE_LOCALES[locale.value as keyof typeof DATE_LOCALES];
});

const df = computed(
  () =>
    new DateFormatter(dateLocale.value, {
      dateStyle: "medium",
    }),
);

const tz = getLocalTimeZone();

function toISOString(value: DateValue) {
  return new Date(
    Date.UTC(value.year, value.month - 1, value.day),
  ).toISOString();
}

const calendarValue = shallowRef<DateRange | undefined>(
  modelValue.value.start && modelValue.value.end
    ? {
        start: parseDate(modelValue.value.start.slice(0, 10)),
        end: parseDate(modelValue.value.end.slice(0, 10)),
      }
    : undefined,
);

function onCalendarChange(value: DateRange | null) {
  calendarValue.value = value ?? undefined;

  if (!value?.start) {
    modelValue.value = {
      start: "",
      end: "",
    };

    return;
  }

  modelValue.value = {
    start: toISOString(value.start),
    end: value.end ? toISOString(value.end) : "",
  };
}

const label = computed(() => {
  if (!modelValue.value.start) {
    return t("UI.datePicker.placeholder");
  }

  const start = parseDate(modelValue.value.start.slice(0, 10));

  if (!modelValue.value.end) {
    return df.value.format(start.toDate(tz));
  }

  const end = parseDate(modelValue.value.end.slice(0, 10));

  return `${df.value.format(start.toDate(tz))} - ${df.value.format(
    end.toDate(tz),
  )}`;
});
</script>

<template>
  <UPopover :content="{ align: 'center' }">
    <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
      {{ label }}
    </UButton>

    <template #content>
      <UCalendar
        :model-value="calendarValue"
        range
        class="p-2"
        @update:model-value="onCalendarChange"
      />
    </template>
  </UPopover>
</template>
