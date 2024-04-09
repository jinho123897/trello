import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { CgPlayListAdd } from "react-icons/cg";
import { toDoState } from "./atoms";
import Board from "./Components/Board";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  padding: 50px;
`;
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    outline: none;
    border: none;
    font-size: 40px;
    background-color: transparent;
    cursor: pointer;
  }
`;
const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #f0f0f0;
`;
const Boards = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
  height: calc(100% - 110px);
  padding: 50px;
  overflow-x: scroll;
  position: fixed;
  top: 102px;
  left: 0;
`;
function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, draggableId, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // 같은 보드 내 이동
      setToDos((allBoards) => {
        const allBoardsCopy = [...allBoards];
        const boardIndex = allBoardsCopy.findIndex(
          (board) => board.title === source.droppableId
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

    if (destination.droppableId !== source.droppableId) {
      // 다른 보드 이동
      setToDos((allBoards) => {
        const allBoardsCopy = [...allBoards];
        const targetBoardIndex = allBoardsCopy.findIndex(
          (board) => board.title === destination.droppableId
        );
        const sourceBoardIndex = allBoardsCopy.findIndex(
          (board) => board.title === source.droppableId
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
  };
  const EditBoard = () => {
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
    <Wrapper>
      <Header>
        <Title>To Do List</Title>
        <button onClick={EditBoard}>
          <CgPlayListAdd />
        </button>
      </Header>

      <DragDropContext onDragEnd={onDragEnd}>
        <Boards>
          {toDos.map((board) => (
            <Board
              key={board.id}
              boardId={board.id}
              boardTitle={board.title}
              list={board.list}
            />
          ))}
        </Boards>
      </DragDropContext>
    </Wrapper>
  );
}
export default App;
