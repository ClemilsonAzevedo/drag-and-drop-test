'use client';

import { DragDropContext, Draggable, type DropResult, Droppable } from '@hello-pangea/dnd';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type componentType = {
  id: string;
  name: string;
  value: string;
  imageUrl?: string;
};

const components: componentType[] = [
  { id: '1', name: "Title", value: 'h1' },
  { id: '2', name: "Paragraph", value: 'p' },
  { id: '3', name: "Button", value: 'button' },
  { id: '4', name: "Image", value: 'img' },
  { id: '5', name: "Divider", value: 'hr' }
];

export default function EmailBuilder() {
  const [availableComponents, setAvailableComponents] = useState<componentType[]>(components);

  // Template inicial pré-configurado
  const initialTemplate: componentType[] = [
    { id: uuidv4(), name: "Title", value: "h1" },
    { id: uuidv4(), name: "Paragraph", value: "p" },
    { id: uuidv4(), name: "Image", value: "img", imageUrl: "https://via.placeholder.com/250" },
    { id: uuidv4(), name: "Divider", value: "hr" },
    { id: uuidv4(), name: "Button", value: "button" },
  ];

  const [emailTemplate, setEmailTemplate] = useState<componentType[]>(initialTemplate);

  // Função para lidar com o drag-and-drop
  function onDragEnd(result: DropResult) {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      if (source.droppableId === "available-components" && destination.droppableId === "email-template") {
        const movedItem = availableComponents[source.index];
        const newItem = { ...movedItem, id: uuidv4() };

        setEmailTemplate((prev) => [
          ...prev.slice(0, destination.index),
          newItem,
          ...prev.slice(destination.index),
        ]);
      }
    } else {
      const list = source.droppableId === "available-components" ? availableComponents : emailTemplate;
      const reorderedList = Array.from(list);
      const [movedItem] = reorderedList.splice(source.index, 1);
      reorderedList.splice(destination.index, 0, movedItem);

      if (source.droppableId === "available-components") {
        setAvailableComponents(reorderedList);
      } else {
        setEmailTemplate(reorderedList);
      }
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEmailTemplate((prev) => {
          const updatedTemplate = [...prev];
          updatedTemplate[index] = { ...updatedTemplate[index], imageUrl: reader.result as string };
          return updatedTemplate;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const url = e.target.value;
    setEmailTemplate((prev) => {
      const updatedTemplate = [...prev];
      updatedTemplate[index] = { ...updatedTemplate[index], imageUrl: url };
      return updatedTemplate;
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex items-start justify-center w-full h-screen gap-5">
        {/* Lista de componentes disponíveis */}
        <aside className="flex h-full flex-col items-center justify-start p-5 bg-neutral-200 w-1/5">
          <h2 className="text-lg font-bold mb-4">Available Components</h2>
          <Droppable droppableId="available-components" direction="vertical">
            {(provided) => (
              <ul
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-5"
              >
                {availableComponents.map((component, index) => (
                  <Draggable
                    key={component.id}
                    draggableId={component.id}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        className="text-xl cursor-grab bg-white p-2 rounded shadow"
                      >
                        {component.name}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </aside>

        {/* Email Template */}
        <section className="flex h-full flex-1 flex-col items-start justify-start bg-neutral-50 p-5 border border-dashed border-gray-400">
          <h2 className="text-lg font-bold mb-4">Email Template</h2>
          <Droppable droppableId="email-template" direction="vertical">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="w-full space-y-3"
              >
                {emailTemplate.map((component, index) => (
                  <Draggable
                    key={component.id}
                    draggableId={component.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        className="px-3"
                      >
                        {component.value === "h1" && (
                          <input
                            className="flex w-full text-center items-center mx-auto justify-center text-2xl bg-transparent focus:outline-none border-none placeholder:text-black font-bold p-3"
                            type="text"
                            placeholder="Title"
                          />
                        )}
                        {component.value === "p" && (
                          <textarea
                            className="flex resize-none max-h-max w-full text-center items-center mx-auto justify-center bg-transparent focus:outline-none border-none placeholder:text-black p-3"
                            placeholder="Paragraph"
                          />
                        )}
                        {component.value === "button" && (
                          <button
                            type="button"
                            className="bg-violet-400 text-white text-sm px-5 py-3 flex items-center justify-center rounded-xl mx-auto"
                          >
                            <input
                              className="flex text-sm w-full text-center items-center mx-auto justify-center bg-transparent focus:outline-none border-none placeholder:text-black font-bold"
                              type="text"
                              placeholder="Button"
                            />
                          </button>
                        )}
                        {component.value === "img" && (
                          <>
                            {component.imageUrl ? (
                              <img
                                src={component.imageUrl}
                                alt="Selected"
                                className="mt-2 w-full max-w-xs mx-auto rounded-lg"
                              />
                            ) : (
                              <div className="flex gap-2 mt-2">
                                <input
                                  type="file"
                                  className="hidden"
                                  id={`file-input-${index}`}
                                  onChange={(e) => handleImageChange(e, index)}
                                />
                                <label
                                  htmlFor={`file-input-${index}`}
                                  className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                  Upload Image
                                </label>
                                <input
                                  type="text"
                                  placeholder="Paste image URL"
                                  className="border p-2 rounded flex-1"
                                  onChange={(e) => handleImageUrlChange(e, index)}
                                />
                              </div>
                            )}
                          </>
                        )}
                        {component.value === "hr" && <hr className="border border-neutral-300" />}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </section>
      </div>
    </DragDropContext>
  );
}
