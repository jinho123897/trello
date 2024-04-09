import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { IoClose, IoPencil } from "react-icons/io5";
import { FaTrashAlt } from "react-icons/fa";
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
  padding: 15px 10px;
  border-radius: 5px;
  transition: all 0.3s ease-in;
  &:hover > div {
    opacity: 1;
  }
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
  opacity: 0;
  transition: all 0.2s ease-in;
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
  boardId: number;
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
  const { register, setValue, handleSubmit } = useForm<IForm>({
    defaultValues: {
      toDoText: toDoText,
    },
  });

  const toggleEdit = () => {
    setIsModify((prev) => !prev);
  };
  const onValid = ({ toDoText }: IForm) => {
    setToDos((prev) => {
      const newList = {
        id: Date.now(),
        text: toDoText,
      };

      const allBoardCopy = [...prev];
      const boardIndex = allBoardCopy.findIndex(
        (board) => board.id === boardId
      );
      const BoardCopy = { ...allBoardCopy[boardIndex] };
      const listCopy = [...BoardCopy.list];
      const listIndex = allBoardCopy[boardIndex].list.findIndex(
        (list) => list.id === toDoId
      );

      listCopy.splice(listIndex, 1, newList);
      BoardCopy.list = listCopy;
      allBoardCopy.splice(boardIndex, 1, BoardCopy);

      return allBoardCopy;
    });

    toggleEdit();
  };
  const onDelete = () => {
    if (window.confirm("이 목록을 삭제하시겠습니까?")) {
      setToDos((prev) => {
        const allBoardCopy = [...prev];
        // 클릭한 보드의 인덱스
        const boardIndex = allBoardCopy.findIndex(
          (board) => board.id === boardId
        );
        // 클릭한 보드 복사
        const BoardCopy = { ...allBoardCopy[boardIndex] };
        // 클릭한 todo list 복사
        const listCopy = [...BoardCopy.list];
        // 클릭한 todo list의 index
        const listIndex = BoardCopy.list.findIndex(
          (item) => item.id === toDoId
        );

        listCopy.splice(listIndex, 1);
        BoardCopy.list = listCopy;
        allBoardCopy.splice(boardIndex, 1, BoardCopy);
        return allBoardCopy;
      });
    }
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
                <ModBtn onClick={toggleEdit}>
                  <IoPencil />
                </ModBtn>
                <DelBtn onClick={onDelete}>
                  <FaTrashAlt />
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
