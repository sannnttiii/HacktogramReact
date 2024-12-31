import { useState } from "react";

function Task1() {
    // TODO: answer here
}

function Task1_1(props) {
    // TODO: answer here
}

function Task1_2() {
    const [name, setName] = useState("Ganti namaku");

    return (
        <div>
            <h1>{name}</h1>
            <button onClick={() => setName("Imam Assidiqqi")}>
                Change Name
            </button>
        </div>
    );
}

export { Task1, Task1_1, Task1_2 };
