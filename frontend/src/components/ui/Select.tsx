import { Feather } from "@expo/vector-icons";
import { styled, Text } from "dripsy";
import { ComponentProps, Fragment, useState } from "react";
import { FlatList, ListRenderItem, Modal, Pressable } from "react-native";
import { Button } from "./Button";

const IconComponent = styled(Feather)();
const StyledOverlay = styled(Pressable)();
const StyledModalContent = styled(Pressable)();
const StyledOptionRow = styled(Pressable)();

export type ItemProps = {
  label: string;
  value: string;
};

export type SelectProps = Omit<
  ComponentProps<typeof Pressable>,
  "children" | "style"
> & {
  placeholder?: string;
  placeholderModal?: string;
  selectedValue?: ItemProps;
  data: ItemProps[];
  onSelect?: (item: ItemProps) => void;
};

export const Select = ({
  placeholder = "Selecione um time",
  placeholderModal = "Selecione um time",
  selectedValue,
  data,
  onSelect,
}: SelectProps) => {
  const [timeSelecionado, setTimeSelecionado] = useState(selectedValue?.label);
  const [modalVisivel, setModalVisivel] = useState(false);

  const handlePressSelect = () => {
    setModalVisivel(true);
  };

  const selecionarTime = (item: ItemProps) => {
    setTimeSelecionado(item.label);
    setModalVisivel(false);
    onSelect?.(item);
  };

  const renderItem: ListRenderItem<ItemProps> = ({ item }) => (
    <StyledOptionRow
      onPress={() => selecionarTime(item)}
      sx={{
        paddingVertical: "$3",
        borderBottomWidth: 1,
        borderBottomColor: "$bgSecondary",
      }}
      style={({ pressed }) => ({
        backgroundColor: pressed ? "#29292E" : "transparent",
      })}
    >
      <Text variant="paragraph" sx={{ color: "$grey" }}>
        {item.label}
      </Text>
    </StyledOptionRow>
  );

  return (
    <Fragment>
      <Button
        onPress={handlePressSelect}
        sx={{
          width: "100%",
          height: 56,
          backgroundColor: "$bgTerciary",
          borderRadius: 6,
          padding: "$3",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          variant="paragraph"
          sx={{
            color: "$darkGrey",
          }}
        >
          {timeSelecionado ? timeSelecionado : placeholder}
        </Text>

        <IconComponent
          name="chevron-down"
          size={18}
          sx={{
            color: "$darkGrey",
          }}
        />
      </Button>
      <Modal
        visible={modalVisivel}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisivel(false)}
      >
        <StyledOverlay
          onPress={() => setModalVisivel(false)}
          sx={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            justifyContent: "flex-end",
          }}
        >
          <StyledModalContent
            onPress={(e) => e.stopPropagation()}
            sx={{
              backgroundColor: "$bgTerciary",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: "$4",
              maxHeight: "100%",
              height: "40%",
            }}
          >
            <Text
              variant="h2"
              sx={{
                color: "$white",
                marginBottom: 16,
              }}
            >
              {placeholderModal}
            </Text>
            <FlatList
              data={data}
              keyExtractor={(item) => item.value}
              renderItem={renderItem}
            />
          </StyledModalContent>
        </StyledOverlay>
      </Modal>
    </Fragment>
  );
};

Select.displayName = "Select";
