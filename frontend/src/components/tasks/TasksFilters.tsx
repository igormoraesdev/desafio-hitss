import Feather from "@expo/vector-icons/Feather";
import { FilterParams } from "@/models/api";
import { Box, createThemedComponent, Flex, styled, Text } from "dripsy";
import { Fragment, useState } from "react";
import { Modal, Pressable } from "react-native";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const FilterIcon = createThemedComponent(Feather);
const StyledOverlay = styled(Pressable)();
const StyledModalContent = styled(Pressable)();

export type TaskFilterValues = Pick<FilterParams, "status" | "sortBy" | "order">;

type StatusOption = {
  label: string;
  value: FilterParams["status"];
};

type SortOption = {
  label: string;
  sortBy: NonNullable<FilterParams["sortBy"]>;
  order: NonNullable<FilterParams["order"]>;
};

const STATUS_OPTIONS: StatusOption[] = [
  { label: "Todas", value: undefined },
  { label: "Pendente", value: "PENDING" },
  { label: "Em progresso", value: "IN_PROGRESS" },
  { label: "Concluída", value: "COMPLETED" },
];

const SORT_OPTIONS: SortOption[] = [
  { label: "Mais recentes", sortBy: "createdAt", order: "desc" },
  { label: "Mais antigas", sortBy: "createdAt", order: "asc" },
  { label: "Título A-Z", sortBy: "title", order: "asc" },
  { label: "Status", sortBy: "status", order: "asc" },
];

export const DEFAULT_TASK_FILTERS: TaskFilterValues = {
  status: undefined,
  sortBy: "createdAt",
  order: "desc",
};

type TasksFiltersProps = {
  search: string;
  filters: TaskFilterValues;
  onSearchChange: (text: string) => void;
  onFiltersChange: (filters: TaskFilterValues) => void;
};

const styles = {
  row: {
    width: "100%",
    gap: "$2",
    alignItems: "center",
  },
  filterButton: {
    width: 56,
    height: 56,
    borderRadius: 6,
    backgroundColor: "$bgTerciary",
  },
  activeDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "$lighGreen",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "$bgTerciary",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: "$4",
    gap: "$4",
  },
  sectionTitle: {
    color: "$darkGrey",
    marginBottom: "$2",
  },
  chips: {
    flexWrap: "wrap",
    gap: "$2",
  },
  chip: {
    width: "auto",
    height: 36,
    paddingHorizontal: "$3",
    borderRadius: 100,
    backgroundColor: "$bgSecondary",
  },
  chipActive: {
    backgroundColor: "$green",
  },
  actions: {
    gap: "$2",
  },
} as const;

type ChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

const Chip = ({ label, active, onPress }: ChipProps) => (
  <Button
    onPress={onPress}
    sx={{ ...styles.chip, ...(active ? styles.chipActive : {}) }}
  >
    <Text variant="span" sx={{ color: active ? "$white" : "$grey" }}>
      {label}
    </Text>
  </Button>
);

export const TasksFilters = ({
  search,
  filters,
  onSearchChange,
  onFiltersChange,
}: TasksFiltersProps) => {
  const [showModal, setShowModal] = useState(false);
  const [draft, setDraft] = useState<TaskFilterValues>(filters);

  const hasActiveFilters =
    filters.status !== undefined ||
    filters.sortBy !== DEFAULT_TASK_FILTERS.sortBy ||
    filters.order !== DEFAULT_TASK_FILTERS.order;

  const openModal = () => {
    setDraft(filters);
    setShowModal(true);
  };

  const applyFilters = () => {
    onFiltersChange(draft);
    setShowModal(false);
  };

  const clearFilters = () => {
    onFiltersChange(DEFAULT_TASK_FILTERS);
    setShowModal(false);
  };

  return (
    <Fragment>
      <Flex sx={styles.row}>
        <Box sx={{ flex: 1 }}>
          <Input
            value={search}
            onChangeText={onSearchChange}
            placeholder="Busque uma tarefa"
            icon
          />
        </Box>
        <Button hasStyle={false} sx={styles.filterButton} onPress={openModal}>
          <Fragment>
            <FilterIcon name="sliders" size={24} sx={{ color: "$green" }} />
            {hasActiveFilters ? <Box sx={styles.activeDot} /> : null}
          </Fragment>
        </Button>
      </Flex>

      <Modal
        visible={showModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <StyledOverlay onPress={() => setShowModal(false)} sx={styles.overlay}>
          <StyledModalContent
            onPress={(e) => e.stopPropagation()}
            sx={styles.modal}
          >
            <Text variant="h2" sx={{ color: "$white" }}>
              Filtros
            </Text>

            <Box>
              <Text variant="span" sx={styles.sectionTitle}>
                Status
              </Text>
              <Flex sx={styles.chips}>
                {STATUS_OPTIONS.map((option) => (
                  <Chip
                    key={option.label}
                    label={option.label}
                    active={draft.status === option.value}
                    onPress={() =>
                      setDraft((current) => ({
                        ...current,
                        status: option.value,
                      }))
                    }
                  />
                ))}
              </Flex>
            </Box>

            <Box>
              <Text variant="span" sx={styles.sectionTitle}>
                Ordenar por
              </Text>
              <Flex sx={styles.chips}>
                {SORT_OPTIONS.map((option) => (
                  <Chip
                    key={option.label}
                    label={option.label}
                    active={
                      draft.sortBy === option.sortBy &&
                      draft.order === option.order
                    }
                    onPress={() =>
                      setDraft((current) => ({
                        ...current,
                        sortBy: option.sortBy,
                        order: option.order,
                      }))
                    }
                  />
                ))}
              </Flex>
            </Box>

            <Box sx={styles.actions}>
              <Button onPress={applyFilters}>Aplicar</Button>
              <Button
                onPress={clearFilters}
                sx={{ backgroundColor: "$bgSecondary" }}
              >
                Limpar filtros
              </Button>
            </Box>
          </StyledModalContent>
        </StyledOverlay>
      </Modal>
    </Fragment>
  );
};
