import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Card = styled.div<{ $isDragging: boolean }>`
  background-color: ${(props) =>
    props.$isDragging ? "#b3b3b3" : props.theme.cardColor};
  box-shadow: 3px 3px 3px rgba(149, 157, 165, 0.2);
  margin-bottom: 5px;
  padding: 5px 10px;
  border-radius: 5px;
  transition: all 0.3s ease-in;
`;

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

function DraggableCard({ toDoId, toDoText, index }: IDraggableCardProps) {
  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {(provided, snapshot) => (
        <Card
          $isDragging={snapshot.isDragging}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          {toDoText}
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableCard);
