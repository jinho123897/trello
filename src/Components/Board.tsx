import { useForm } from "react-hook-form";
import { Droppable } from "react-beautiful-dnd";
import DragabbleCard from "./DraggableCard";
import styled from "styled-components";
import { IToDo, toDoState } from "../atoms";
import { useRecoilState, useSetRecoilState } from "recoil";

const Wrapper = styled.div`
  padding: 20px 10px;
  padding-top: 10px;
  background-color: #fdfdfd;
  box-shadow: 0px 7px 29px 0px rgba(100, 100, 111, 0.2);
  border-radius: 10px;
  min-height: 200px;
  min-width: 200px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
`;

interface IAreaProps {
  $isDraggingOver: boolean;
  $isDraggingFromThis: boolean;
}

const Area = styled.div<IAreaProps>`
  padding: 3px;
  border-radius: 3px;
  background-color: ${(props) =>
    props.$isDraggingOver
      ? "rgba(255, 0, 0, 0.3)"
      : props.$isDraggingFromThis
      ? "rgba(255, 0, 0, 0.1)"
      : "rgba(0, 0, 0, 0)"};
  flex-grow: 1;
  transition: all 0.3s linear;
`;

const Form = styled.form`
  width: 100%;
`;

const Input = styled.input`
  font-size: 16px;
  padding: 5px;
  width: 100%;
  border: none;
  border-bottom: 1px solid #888;
  &:focus {
    outline: none;
  }
`;
const SubmitBtn = styled.button``;

interface IBoardProps {
  toDos: IToDo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };

    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });

    setValue("toDo", "");
  };

  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <Input
          {...register("toDo", { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
      </Form>
      <Droppable droppableId={boardId}>
        {(provided, snapshot) => (
          <Area
            $isDraggingOver={snapshot.isDraggingOver}
            $isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DragabbleCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
              />
            ))}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
