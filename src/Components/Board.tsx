import { useForm } from "react-hook-form";
import { DraggableProvided, Droppable } from "react-beautiful-dnd";
import DragabbleCard from "./DraggableCard";
import styled from "styled-components";
import { IToDo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
import { IoPencil } from "react-icons/io5";
import { FaTrashAlt } from "react-icons/fa";
import { HiMiniBars2 } from "react-icons/hi2";
import React from "react";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fdfdfd;
  box-shadow: 0px 7px 29px 0px rgba(100, 100, 111, 0.2);
  border-radius: 10px;
  min-width: 280px;
  max-width: 320px;
  max-height: calc(100% - 50px);
  margin: 0 10px;
  position: relative;
`;
const FloatingBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  position: absolute;
  pointer-events: none;
  z-index: 1;
  & > * {
    pointer-events: all;
  }
`;
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  &:hover div {
    opacity: 1;
  }
`;
const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-right: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
`;
const Icons = styled.div`
  display: flex;
  align-items: center;
  opacity: 0;
  transition: 0.2s all ease-in;
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
const MoveBtn = styled(ModBtn)``;
interface IAreaProps {
  $isDraggingOver: boolean;
  $isDraggingFromThis: boolean;
}

const Area = styled.div<IAreaProps>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 60px 0 50px;
  padding: 10px;
  background-color: ${(props) =>
    props.$isDraggingOver
      ? "rgba(255, 0, 0, 0.3)"
      : props.$isDraggingFromThis
      ? "rgba(255, 0, 0, 0.1)"
      : "rgba(0, 0, 0, 0)"};
  transition: all 0.3s linear;
  width: 100%;
  min-height: 80px;
  max-height: calc(100% - 200px);
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #999;
    border-radius: 3px;
    background-clip: padding-box;
    border: 1px solid transparent;
    transition: background-color 0.3s;
  }
`;

const Form = styled.form`
  width: 100%;
  padding: 10px;
  background-color: #bebebe;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const Input = styled.input`
  font-size: 16px;
  padding: 5px;
  width: 100%;
  border: none;
  border-bottom: 1px solid #888;
  background-color: transparent;
  &:focus {
    outline: none;
  }
`;
const SubmitBtn = styled.button``;

interface IBoardProps {
  list: IToDo[];
  boardTitle: string;
  boardId: number;
  parentsProvided: DraggableProvided;
}

interface IForm {
  toDo: string;
}

function Board({ list, boardTitle, boardId, parentsProvided }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>({
    defaultValues: {
      // boardTitle: boardTitle,
    },
  });
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };

    setToDos((allBoards) => {
      const allBoardsCopy = [...allBoards];
      const boardIndex = allBoardsCopy.findIndex(
        (board) => board.id === boardId
      );
      const boardCopy = { ...allBoardsCopy[boardIndex] };

      boardCopy.list = [newToDo, ...boardCopy.list];
      allBoardsCopy.splice(boardIndex, 1, boardCopy);
      return allBoardsCopy;
    });

    setValue("toDo", "");
  };
  const onChangeEditMode = () => {
    const newTitle = window.prompt(
      "수정할 보드 이름을 적어주세요.",
      boardTitle
    );
    if (newTitle) {
      setToDos((allBoards) => {
        const allBoardsCopy = [...allBoards];
        const targetBoardIndex = allBoardsCopy.findIndex(
          (board) => board.id === boardId
        );
        const targetBoardCopy = { ...allBoardsCopy[targetBoardIndex] };

        targetBoardCopy.title = newTitle;
        allBoardsCopy.splice(targetBoardIndex, 1, targetBoardCopy);

        return allBoardsCopy;
      });
    }
  };
  const deleteBoard = () => {
    if (window.confirm(`${boardTitle} 보드를 삭제하시겠습니까?`)) {
      setToDos((allBoards) => {
        const allBoardsCopy = [...allBoards];
        const targetBoardIndex = allBoardsCopy.findIndex(
          (board) => board.id === boardId
        );
        allBoardsCopy.splice(targetBoardIndex, 1);

        return allBoardsCopy;
      });
    }
  };

  return (
    <Droppable droppableId={"board-" + boardTitle} type="BOARD">
      {(provided, snapshot) => (
        <Wrapper
          ref={parentsProvided.innerRef}
          {...parentsProvided.draggableProps}
        >
          <FloatingBox>
            <Header>
              <Title>{boardTitle}</Title>
              <Icons>
                <ModBtn onClick={onChangeEditMode}>
                  <IoPencil />
                </ModBtn>
                <DelBtn onClick={deleteBoard}>
                  <FaTrashAlt />
                </DelBtn>
                <MoveBtn {...parentsProvided.dragHandleProps}>
                  <HiMiniBars2 />
                </MoveBtn>
              </Icons>
            </Header>
            <Form onSubmit={handleSubmit(onValid)}>
              <Input
                {...register("toDo", { required: true })}
                type="text"
                placeholder={`Add task on ${boardTitle}`}
              />
            </Form>
          </FloatingBox>
          <Area
            $isDraggingOver={snapshot.isDraggingOver}
            $isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {list.map((toDo, index) => (
              <DragabbleCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
                boardId={boardId}
              />
            ))}
            {provided.placeholder}
          </Area>
        </Wrapper>
      )}
    </Droppable>
  );
}

export default React.memo(Board);
