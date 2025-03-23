import { useState } from 'react';
import axios from 'axios';


export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [status, setStatus] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8000/contact", form);
            setStatus("Message Sent Successfully");
            setForm({
                name: "",
                email: "",
                message: ""
            });
        } catch (error) {
            setStatus("Message Failed to Send");

        }
    };
    return (
        <div>
            <h1>Contact Me</h1>
            {/*<form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required

                />
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                />
                <button type="submit">Send</button>

            </form>*/}
            <p>Coming Soon</p>
            {status && <p>{status}</p>}
        </div>

    );
}