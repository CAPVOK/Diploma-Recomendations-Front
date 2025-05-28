import { useState, useMemo, ReactNode } from "react";
import { IQuestion, IQuestionTypeEnum } from "@/entities/question";
import { Group, Select, TextInput } from "@mantine/core";

interface QuestionLibraryProps {
  questions: IQuestion[];
  renderQuestions: (qs: IQuestion[]) => ReactNode;
  manageButtons?: ReactNode;
  filtersWithoutGap?: boolean;
}

const questionTypeOptions = [
  { value: "SINGLE", label: "Один ответ" },
  { value: "MULTIPLE", label: "Несколько ответов" },
  { value: "TEXT", label: "Текстовый ответ" },
  { value: "NUMBER", label: "Числовой ответ" },
];

export const QuestionLibrary: React.FC<QuestionLibraryProps> = ({
  questions,
  renderQuestions,
  manageButtons,
  filtersWithoutGap,
}) => {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 1) Фильтруем по типу
  const byType = useMemo(
    () =>
      filterType ? questions.filter((q) => q.type === filterType) : questions,
    [questions, filterType]
  );

  // 2) Дополнительно фильтруем по названию (поиск)
  const visibleQuestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return byType.filter((q) => {
      // 1. Заголовок
      let searchString = q.title.toLowerCase();

      // 2. Варианты ответов (если есть)
      if (q.variants && Object.keys(q.variants).length) {
        searchString +=
          " " +
          Object.values(q.variants)
            .map((v) => v.toLowerCase())
            .join(" ");
      }

      // 3. Правильный ответ, если текст/число
      if (
        q.type === IQuestionTypeEnum.Number ||
        q.type === IQuestionTypeEnum.Text
      ) {
        searchString += " " + q.answer?.toString().toLowerCase();
      }

      return searchString.includes(query);
    });
  }, [byType, searchQuery]);

  return (
    <>
      <Group
        mb={filtersWithoutGap ? undefined : "md"}
        gap="sm"
        justify="space-between"
      >
        <Group>
          <Select
            data={questionTypeOptions}
            value={filterType}
            onChange={setFilterType}
            placeholder="Все типы"
            clearable
          />
          <TextInput
            placeholder="Поиск по слову"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
          />
        </Group>
        {manageButtons}
      </Group>

      {visibleQuestions.length === 0 ? (
        <div>Нет вопросов</div>
      ) : (
        renderQuestions(visibleQuestions)
      )}
    </>
  );
};
