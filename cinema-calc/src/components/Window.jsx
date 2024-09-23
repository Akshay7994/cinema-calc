import React, { useState } from "react";

import "./Window.css";

export const Window = ({ closeWindow, onSubmit, defaultValue }) => {
    const [formState, setFormState] = useState(
        defaultValue || {
            name: "",
            price: "",
            percentage: ""
        }
    );
    const [errors, setErrors] = useState("");

    const validateForm = () => {
        if (formState.name && formState.price && formState.percentage) {
            setErrors("");
            return true;
        } else {
            let errorFields = [];
            for (const [key, value] of Object.entries(formState)) {
                if (!value) {
                    errorFields.push(key);
                }
            }
            setErrors(errorFields.join(", "));
            return false;
        }
    };

    const handleChange = (e) => {
        // console.log(e.target)
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        console.log("Clicked")
        e.preventDefault();
        if (!validateForm()) {
            console.log("Invalid Form")
            return;
        }

        console.log(formState)
        onSubmit(formState);

        closeWindow();
    };

    const handleCancel = (e) => {
        e.preventDefault();
        closeWindow();
    };

    return (
        <div
            className="modal-container"
            onClick={(e) => {
                if (e.target.className === "modal-container") closeWindow();
            }}
        >
            <div className="modal">
                <form>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input name="name" onChange={handleChange} value={formState.name} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price (€)</label>
                        <input
                            name="price"
                            type="number"
                            onChange={handleChange}
                            value={formState.price}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="percentage">Percentage (%)</label>
                        <input name="percentage" type="number" min="0" max="100" onChange={handleChange} value={formState.percentage} />
                    </div>
                    {errors && <div className="error">{`Please include: ${errors}`}</div>}
                    <button type="submit" className="gradButton" onClick={handleSubmit}>
                        Submit
                    </button>
                    <button type="cancel" className="gradButton" onClick={handleCancel}>Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};
