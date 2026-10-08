<script setup lang="ts">
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  type DateValue,
} from "@internationalized/date";
import { DATE_LOCALES, LOCALES } from "~/constants/locale";
const modelValue = defineModel<string | undefined>();

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

const calendarValue = computed<DateValue | undefined>({
  get() {
    if (!modelValue.value) return undefined;

    return parseDate(modelValue.value.slice(0, 10));
  },

set(value) {
  if (!value) {
    modelValue.value = undefined;
    return;
  }

  modelValue.value = new Date(
    Date.UTC(value.year, value.month - 1, value.day),
  ).toISOString();
},
});
</script>

<template>
  <UPopover>
    <UButton
      color="neutral"
      variant="subtle"
      icon="i-lucide-calendar"
    >
      {{
        calendarValue
          ? df.format(calendarValue.toDate(getLocalTimeZone()))
          : t("UI.datePicker.placeholder")
      }}
    </UButton>

    <template #content>
      <UCalendar
        v-model="calendarValue"
        class="p-2"
      />
    </template>
  </UPopover>
</template>