import React, { useState, useEffect } from 'react';
import image1 from "../../assets/images/courses/1.jpeg";
import image2 from "../../assets/images/courses/2.webp";
import image3 from "../../assets/images/courses/3.jpg";
import image4 from "../../assets/images/courses/4.webp";
import image5 from "../../assets/images/courses/5.jpg";
import image6 from "../../assets/images/courses/6.jpeg";
import image7 from "../../assets/images/courses/7.webp";
import image8 from "../../assets/images/courses/8.webp";
import image9 from "../../assets/images/courses/9.webp";
import image10 from "../../assets/images/courses/10.jpg";
import image11 from "../../assets/images/courses/11.jpg";
import image12 from "../../assets/images/courses/12.jpg";
import image13 from "../../assets/images/courses/13.jpg";
import image14 from "../../assets/images/courses/14.jpg";
import image15 from "../../assets/images/courses/15.jpg";
import image16 from "../../assets/images/courses/16.jpg";
import image17 from "../../assets/images/courses/17.jpg";
import image18 from "../../assets/images/courses/18.jpg";
import image19 from "../../assets/images/courses/19.jpg";
import image20 from "../../assets/images/courses/20.webp";
import image21 from "../../assets/images/courses/21.jpeg";
import image22 from "../../assets/images/courses/22.webp";
import image23 from "../../assets/images/courses/23.jpeg";
import image24 from "../../assets/images/courses/24.jpeg";
import image25 from "../../assets/images/courses/25.webp";
import image26 from "../../assets/images/courses/26.jpeg";
import image27 from "../../assets/images/courses/27.webp";
import image28 from "../../assets/images/courses/28.webp";
import image29 from "../../assets/images/courses/29.jpeg";
import image30 from "../../assets/images/courses/30.webp";
import image31 from "../../assets/images/courses/31.avif";
import image32 from "../../assets/images/courses/32.webp";
import image33 from "../../assets/images/courses/33.webp";
import image34 from "../../assets/images/courses/34.webp";
import image35 from "../../assets/images/courses/35.webp";
import image36 from "../../assets/images/courses/36.webp";


export default function RandomImage(pageProps) {
    // Assume you have 19 images, adjust this number based on your actual image count
    const initImage = [
        image1, image2, image3, image4, image5, image6, image7, image8, image9, image10,
        image11, image12, image13, image14, image15, image16, image17, image18, image19,
        image20, image21, image22, image23, image24, image25, image26, image27, image28, 
        image29, image30, image31, image32, image33, image34, image35, image36
    ];
    

    const [imageSrc, setImageSrc] = useState('');
    const [usedImages, setUsedImages] = useState([]);

    useEffect(() => {
        // Generate a random number between 1 and totalImages
        const randomNumber = Math.floor(Math.random() * initImage.length + 1);
        const imagePath = initImage[randomNumber - 1];
        setImageSrc(imagePath);
    }, [pageProps]); // The empty array [] means this effect runs only once on mount

    return (
        <img src={imageSrc} alt="Course" style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover', width: '100%' }} />
    );
    }


   
    