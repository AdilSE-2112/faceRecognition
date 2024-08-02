import React, { useState, useEffect, useRef } from 'react';
import { useSearch } from '../../context/searchContext';
import Layout from '../../components/layout';

import './style.scss';

import mockPhoto from './mock photo.png';
import mock from './mockResponse';
import mock2 from './mockResponse2';

import { FaAnglesRight } from "react-icons/fa6";
import axios from 'axios';

function Result() {
    const { iin, file, lastRequest } = useSearch();

    const [isLoading, setLoading] = useState(true);
    const [didSearch, setSearched] = useState(false);

    const canvasRef = useRef(null);
    const [ctx, setCTX] = useState(null);
    const [circles, setCircles] = useState([]);
    const [img, setImage] = useState(null);

    const [currentSubjectIndex, setCurrentSubjectIndex] = useState(-1);
    const [hoverIndex, setHoverIndex] = useState(-1);

    const [mouseXpos, setMouseXpos] = useState(null);
    const [mouseYpos, setMouseYpos] = useState(null);

    const [results, setResults] = useState(lastRequest);
    const [boxes, setBoxes] = useState({});

    const [scaleX, setScaleX] = useState(1);
    const [scaleY, setScaleY] = useState(1);

    const [mainInfo, setMainInfo] = useState({
        first_name: 'Madiyar',
        last_name: 'Kuanyshbekov',
        middle_name: 'Erkebulanuly',
        iin: '020131550302',
        birth_date: '01.01.1990',
    });

    useEffect(() => {
        if (!lastRequest) return;
        setLoading(false);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        setCTX(ctx);
        
        const img = new Image();

        
        if (lastRequest && lastRequest.image_name) {
            img.src = `http://192.168.122.101:9000/history/${results.image_name}`
        } else {
            img.src = URL.createObjectURL(file);
        }
        
        setImage(img);

        img.onload = () => {
            const aspectRatio = img.width / img.height;
            const maxWidth = canvas.parentElement.offsetWidth; // Get parent width
            const maxHeight = 400;

            let newWidth = maxWidth;
            let newHeight = newWidth / aspectRatio;

            if (newHeight > maxHeight) {
                newHeight = maxHeight;
                newWidth = newHeight * aspectRatio;
            }

            canvas.width = newWidth;
            canvas.height = newHeight;

            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            canvas.addEventListener('mousemove', mouseMove);
            canvas.addEventListener('click', mouseClick);

            redrawCanvas();
        }
    }, [file, results, scaleX, scaleY, isLoading, currentSubjectIndex, mouseXpos]);

    const redrawCanvas = () => {
        if (ctx === null || isLoading || results === null) return;
        const canvas = canvasRef.current;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Original image dimensions
        const originalWidth = img.width;
        const originalHeight = img.height;

        // Displayed canvas dimensions
        const displayedWidth = canvas.width;
        const displayedHeight = canvas.height;

        // Scale factors
        setScaleX(originalWidth / displayedWidth);
        setScaleY(originalHeight / displayedHeight);

        // Draw face circles
        results.faces.map((item, index) => {
            saveBoxes(item.bbox, item.milvus_results, index);
            drawFace(item.bbox, index, ctx);
        });
    };

    const saveBoxes = (bbox, m_res, index) => {
        const x_min = bbox[0];
        const x_max = bbox[0] + bbox[2];
        const y_min = bbox[1];
        const y_max = bbox[1] + bbox[3];

        setBoxes(prevValue => {
            return {
                ...prevValue,
                [index]: {
                    "x_min": x_min / scaleX,
                    "x_max": x_max / scaleX,
                    "y_min": y_min / scaleY,
                    "y_max": y_max / scaleY,
                    "results": m_res
                }
            }
        });
    }

    const drawFace = (bbox, index, ctx) => {
        const x_min = bbox[0];
        const x_max = bbox[0] + bbox[2];
        const y_min = bbox[1];
        const y_max = bbox[1] + bbox[3];

        // Scale the coordinates
        const scaledX = x_min / scaleX;
        const scaledY = y_min / scaleY;
        const scaledWidth = (x_max - x_min) / scaleX;
        const scaledHeight = (y_max - y_min) / scaleY;


        if (hoverIndex !== -1 && hoverIndex === `${index}`) {
            ctx.beginPath();
            ctx.rect(scaledX, scaledY, scaledWidth, scaledHeight);
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (currentSubjectIndex !== -1 && currentSubjectIndex === `${index}`) {
            ctx.beginPath();
            ctx.rect(scaledX, scaledY, scaledWidth, scaledHeight);
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.rect(scaledX, scaledY, scaledWidth, scaledHeight);
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    const mouseMove = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left); // Adjust for scaling
        const mouseY = (event.clientY - rect.top);   // Adjust for scaling
        setMouseXpos(mouseX);
        setMouseYpos(mouseY);
        

        let foundHoverIndex = -1;

        for (let boxIndex in boxes) {
            if (mouseX >= boxes[boxIndex].x_min 
                && mouseX <= boxes[boxIndex].x_max 
                && mouseY >= boxes[boxIndex].y_min
                && mouseY <= boxes[boxIndex].y_max
            ) {
                canvas.style.cursor = 'pointer';
                foundHoverIndex = boxIndex;
                break;
            }
        }

        setHoverIndex(foundHoverIndex);
        if (foundHoverIndex === -1) {
            canvas.style.cursor = 'default';
        }

        redrawCanvas();
    }

    const mouseClick = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left); // Adjust for scaling
        const mouseY = (event.clientY - rect.top);   // Adjust for scaling

        let foundSubjectIndex = -1;

        for (let boxIndex in boxes) {
            if (mouseX >= boxes[boxIndex].x_min 
                && mouseX <= boxes[boxIndex].x_max 
                && mouseY >= boxes[boxIndex].y_min
                && mouseY <= boxes[boxIndex].y_max
            ) {
                foundSubjectIndex = boxIndex;
                break;
            }
        }

        setHoverIndex(-1);
        setCurrentSubjectIndex(foundSubjectIndex);
        redrawCanvas(); 
    }

    return ( 
        <Layout>
            <div className='result-page'>
                <div className="container">

                    <div className="main-result-block">
                        <div className="canvas">
                            <canvas ref={canvasRef} alt="img" />
                        </div>
                        {
                            isLoading ? (
                                <div className="info">
                                    Загрузка...
                                </div>
                            ) : (
                                currentSubjectIndex !== -1 
                                    ? (
                                        <div className="info">
                                            <div className="photo">
                                                <img 
                                                    src={
                                                        boxes[currentSubjectIndex].results[0].metadata.photo 
                                                            ? `http://192.168.122.101:9000/photos/${boxes[currentSubjectIndex].results[0].metadata.photo}` 
                                                            : mockPhoto
                                                    } 
                                                    alt="Udostak" 
                                                />
                                            </div>
                                            <div>
                                                <div>ФИО: <span>{boxes[currentSubjectIndex].results[0].metadata.surname || ''} </span>
                                                    <span>{boxes[currentSubjectIndex].results[0].metadata.name || ''} </span>
                                                    <span>{boxes[currentSubjectIndex].results[0].metadata.patronymic || ''} </span>
                                                </div>
                                                <div>ИИН: <span>{boxes[currentSubjectIndex].results[0].metadata.iin || ''}</span></div>
                                                <div>День рождения: <span>{mainInfo.birth_date}</span></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="info">
                                            Нажмите на лицо, чтобы вывести информацию о нем
                                        </div>
                                    )
                            )
                        }
                    </div>

                    <div className="additional-result-block">
                        <h3 className="title">Схожие люди</h3>
                        <div className="cards">
                            {
                                boxes[currentSubjectIndex] && boxes[currentSubjectIndex].results && boxes[currentSubjectIndex].results.slice(1).map((item, index) => {
                                        
                                    return <SimilarCard 
                                        key={index}
                                        full_name={`${item.metadata.surname || ''} ${item.metadata.name || ''} ${item.metadata.patronymic || ''} `}
                                        iin={item.metadata.iin || ''}
                                        image={item.metadata.photo}
                                    />; 
                                })

                                // console.log(boxes[currentSubjectIndex].results.slice(1))
                            }
                        </div>
                    </div>
                </div>                
            </div>
        </Layout>
    );
}

const SimilarCard = ({
    full_name,
    iin,
    image
}) => {

    return (
        <div className="card">
            <div className="photo">
                <img 
                    src={
                        image 
                            ? `http://192.168.122.101:9000/photos/${image}` 
                            : mockPhoto
                    } 
                />
                
            </div>
            <div className="info-block">
                <div className="info">
                    <div>{full_name}</div>
                    <div>{iin}</div>
                </div>
                <div className="actions">
                    <FaAnglesRight />
                </div>
            </div>
        </div>
    )
}

export default Result;
