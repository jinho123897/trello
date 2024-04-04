import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { IoClose, IoPencil } from "react-icons/io5";
import { useRecoilState, useSetRecoilState } from "recoil";
import { toDoState } from "../atoms";
import { useForm } from "react-hook-form";

const Card = styled.div<{ $isDragging: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) =>
    props.$isDragging ? "#b3b3b3" : props.theme.cardColor};
  box-shadow: 0px 8px 24px rgba(149, 157, 165, 0.2);
  margin-bottom: 10px;
  padding: 15px 10px;
  border-radius: 5px;
  transition: all 0.3s ease-in;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
`;

const Input = styled.input`
  width: 100%;
  padding: 5px;
  outline: none;
  border: none;
  border-bottom: 1px solid #b5b2b2;
`;

const Icons = styled.div`
  display: flex;
`;

const ModBtn = styled.button`
  display: flex;
  align-items: center;
  padding: 0px 3px;
  font-size: 16px;
  color: #666;
  outline: none;
  border: none;
  background-color: transparent;
  cursor: pointer;
`;

const DelBtn = styled(ModBtn)``;
const CloseBtn = styled(ModBtn)``;

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
}

interface IForm {
  toDoText: string;
}

function DraggableCard({
  toDoId,
  toDoText,
  index,
  boardId,
}: IDraggableCardProps) {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [isModify, setIsModify] = useState(false);
  const { register, setValue, handleSubmit } = useForm<IForm>();

  const modifyModeHandler = () => {
    setIsModify((prev) => !prev);
  };
  const onValid = ({ toDoText }: IForm) => {
    setToDos((oldToDos) => {
      return {
        ...oldToDos,
        [boardId]: oldToDos[boardId].map((item) => {
          if (item.id === toDoId) {
            return { ...item, text: toDoText };
          }
          return item;
        }),
      };
    });
    setIsModify(false);
  };
  const cardDelete = () => {
    setToDos((oldToDos) => {
      return {
        ...oldToDos,
        [boardId]: oldToDos[boardId].filter((item) => item.id !== toDoId),
      };
    });
  };
  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(provided, snapshot) => (
        <Card
          $isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          {isModify ? (
            <>
              <Form onSubmit={handleSubmit(onValid)}>
                <Input
                  {...register("toDoText", { required: true })}
                  type="text"
                  placeholder="Write down what you want to modify"
                />
                <CloseBtn onClick={handleSubmit(onValid)}>
                  <IoClose />
                </CloseBtn>
              </Form>
            </>
          ) : (
            <>
              <span>{toDoText}</span>
              <Icons>
                <ModBtn onClick={modifyModeHandler}>
                  <IoPencil />
                </ModBtn>
                <DelBtn onClick={cardDelete}>
                  <IoClose />
                </DelBtn>
              </Icons>
            </>
          )}
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableCard);
