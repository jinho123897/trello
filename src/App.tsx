import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { CgPlayListAdd } from "react-icons/cg";
import { toDoState } from "./atoms";
import Board from "./Components/Board";

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  padding: 40px;
  position: fixed;
  top: 0;
  left: 0;
  button {
    outline: none;
    border: none;
    font-size: 40px;
    background-color: transparent;
    cursor: pointer;
  }
`;
const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #f0f0f0;
`;
const Boards = styled.div`
  display: flex;
  align-items: flex-start;
  min-width: calc(100vw - 100px);
  height: calc(100vh - 150px);
  margin: 130px 40px 0;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, draggableId, source } = info;
    if (!destination) return;

    if (source.droppableId === "boards") {
      // 보드 순서 변경
      setToDos((allBoards) => {
        const allBoardsCopy = [...allBoards];
        const targetBoard = allBoardsCopy[source.index];

        allBoardsCopy.splice(source.index, 1);
        allBoardsCopy.splice(destination.index, 0, targetBoard);
        return allBoardsCopy;
      });
    } else if (source.droppableId !== "boards") {
      // 같은 보드 내 이동
      if (destination?.droppableId === source.droppableId) {
        setToDos((allBoards) => {
          const allBoardsCopy = [...allBoards];
          const boardIndex = allBoardsCopy.findIndex(
            (board) => board.title === source.droppableId.split("-")[1]
          );
          const boardCopy = { ...allBoardsCopy[boardIndex] };
          const listCopy = [...boardCopy.list];
          const taskObj = listCopy[source.index];

          listCopy.splice(source.index, 1);
          listCopy.splice(destination.index, 0, taskObj);
          boardCopy.list = listCopy;
          allBoardsCopy.splice(boardIndex, 1, boardCopy);

          return allBoardsCopy;
        });
      }
      // 다른 보드 이동
      if (destination.droppableId !== source.droppableId) {
        setToDos((allBoards) => {
          const allBoardsCopy = [...allBoards];
          const targetBoardIndex = allBoardsCopy.findIndex(
            (board) => board.title === destination.droppableId.split("-")[1]
          );
          const sourceBoardIndex = allBoardsCopy.findIndex(
            (board) => board.title === source.droppableId.split("-")[1]
          );
          const targetBoardCopy = { ...allBoardsCopy[targetBoardIndex] };
          const sourceBoardCopy = { ...allBoardsCopy[sourceBoardIndex] };

          const targetListCopy = [...targetBoardCopy.list];
          const sourceListCopy = [...sourceBoardCopy.list];

          const taskObj = sourceListCopy[source.index];

          sourceListCopy.splice(source.index, 1);
          targetListCopy.splice(destination.index, 0, taskObj);

          sourceBoardCopy.list = sourceListCopy;
          targetBoardCopy.list = targetListCopy;

          allBoardsCopy.splice(sourceBoardIndex, 1, sourceBoardCopy);
          allBoardsCopy.splice(targetBoardIndex, 1, targetBoardCopy);

          return allBoardsCopy;
        });
      }
    }
  };
  const onAddBoard = () => {
    const boardTitle = prompt("생성할 보드의 이름을 적어주세요.");
    if (boardTitle) {
      setToDos((allBoards) => {
        const allBoardsCopy = [...allBoards];
        const newBoard = {
          id: Date.now(),
          title: boardTitle,
          list: [],
        };
        allBoardsCopy.push(newBoard);
        return allBoardsCopy;
      });
    }
  };
  return (
    <>
      <Header>
        <Title>To Do List</Title>
        <button onClick={onAddBoard}>
          <CgPlayListAdd />
        </button>
      </Header>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="boards" direction="horizontal" type="BOARDS">
          {(provided, snapshot) => (
            <Boards ref={provided.innerRef} {...provided.droppableProps}>
              {toDos.map((board, index) => (
                <Draggable
                  draggableId={"board-" + board.id}
                  key={board.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Board
                      boardId={board.id}
                      boardTitle={board.title}
                      list={board.list}
                      parentsProvided={provided}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Boards>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
export default App;
