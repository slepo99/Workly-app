import withNuxt from "./.nuxt/eslint.config.mjs";
import stylistic from "@stylistic/eslint-plugin";

const blankLinesBetweenObjectMethods = {
  meta: {
    type: "layout",
    fixable: "whitespace",
    schema: [],
    messages: {
      missing: "Добавь пустую строку между методами объекта.",
    },
  },

  create(context) {
    const sourceCode = context.sourceCode;

    function isMethod(property) {
      return (
        property.type === "Property" &&
        ["FunctionExpression", "ArrowFunctionExpression"].includes(
          property.value.type,
        )
      );
    }

    return {
      ObjectExpression(node) {
        for (let index = 1; index < node.properties.length; index++) {
          const previous = node.properties[index - 1];
          const current = node.properties[index];

          if (!isMethod(previous) && !isMethod(current)) {
            continue;
          }

          const comma = sourceCode.getTokenAfter(previous);

          if (!comma || comma.value !== ",") {
            continue;
          }

          const gap = sourceCode.text.slice(comma.range[1], current.range[0]);

          if (/\r?\n[ \t]*\r?\n/.test(gap)) {
            continue;
          }

          context.report({
            node: current,
            messageId: "missing",

            fix(fixer) {
              const newline = sourceCode.text.includes("\r\n") ? "\r\n" : "\n";

              return fixer.insertTextAfter(
                comma,
                gap.includes("\n") ? newline : newline + newline,
              );
            },
          });
        }
      },
    };
  },
};

export default withNuxt(
  {
    ignores: [
      "**/node_modules/**",
      "**/.nuxt/**",
      "**/.output/**",
      "**/dist/**",
      "**/coverage/**",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx,vue}"],

    plugins: {
      "@stylistic": stylistic,
      local: {
        rules: {
          "blank-lines-between-object-methods": blankLinesBetweenObjectMethods,
        },
      },
    },

    rules: {
      "local/blank-lines-between-object-methods": "error",

      "@stylistic/padding-line-between-statements": [
        "error",

        // После группы импортов.
        { blankLine: "always", prev: "import", next: "*" },
        { blankLine: "any", prev: "import", next: "import" },

        // После переменных, но короткие объявления можно группировать.
        {
          blankLine: "always",
          prev: ["const", "let", "var"],
          next: "*",
        },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },

        // Многострочные объявления отделяем даже от других переменных.
        {
          blankLine: "always",
          prev: "*",
          next: ["multiline-const", "multiline-let", "multiline-var"],
        },
        {
          blankLine: "always",
          prev: ["multiline-const", "multiline-let", "multiline-var"],
          next: "*",
        },

        // До и после функций, интерфейсов, типов и enum.
        {
          blankLine: "always",
          prev: "*",
          next: ["function", "interface", "type", "enum"],
        },
        {
          blankLine: "always",
          prev: ["function", "interface", "type", "enum"],
          next: "*",
        },

        // До и после if и try.
        {
          blankLine: "always",
          prev: "*",
          next: ["if", "try"],
        },
        {
          blankLine: "always",
          prev: ["if", "try"],
          next: "*",
        },

        // Перед return.
        { blankLine: "always", prev: "*", next: "return" },
      ],
    },
  },
);
