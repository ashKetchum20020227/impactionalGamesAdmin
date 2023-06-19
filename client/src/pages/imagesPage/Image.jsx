
import React, { useState, useRef } from 'react'
import axios from "axios"

function Image() {

    const name = useRef()
    const desc = useRef()
    const [file, setFile] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const formData = new FormData();

        formData.append(
            "file",
            file,
            file.name
        );

        await axios.post("/api/users/timepass", {file: file, name: file.name}, {
            headers: {
            "Content-type": "multipart/form-data",
        },
        })
    }

    return (
        <>
            <form onSubmit={(e) => {handleSubmit(e)}} encType="multipart/form-data">
                <div>
                    <label for="name">Image Title</label>
                    <input ref={name} type="text" id="name" placeholder="Name"
                        name="name" required />
                </div>
                <div>
                    <label for="desc">Image Description</label>
                    <textarea ref={desc} id="desc" name="desc" rows="2"
                            placeholder="Description" required>
                    </textarea>
                </div>
                <div>
                    <label for="image">Upload Image</label>
                    <input type="file" id="image"
                        name="image" required onChange={(e) => {setFile(e.target.files[0]); console.log(e)}} />
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>

            <img className='fake'></img>
        </>
    )
}

export default Image