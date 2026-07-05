let pendingExecution = false;

async function askAI() {

    const question = document.getElementById("question").value.trim();

    if (!question) {

        alert("Please enter a question.");

        return;

    }

    try {

        const response = await fetch(
            `/api/ask?question=${encodeURIComponent(question)}`
        );

        const data = await response.json();

        // ==========================
        // Conversation
        // ==========================

        if (data.conversation) {

            renderConversation(data);

            return;

        }

        // ==========================
        // Generated SQL
        // ==========================

        document.getElementById("sql").innerText =
            data.generatedSQL || "";

        // ==========================
        // Confirmation
        // ==========================

        if (data.requiresConfirmation) {

            renderConfirmation(data);

            return;

        }

        // ==========================
        // Error
        // ==========================

        if (data.error) {

            renderError(data.error);

            return;

        }

        // ==========================
        // Display Table
        // ==========================

        renderTable(data.data);

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}function renderConversation(data) {

    document.getElementById("sql").innerText =
        data.generatedSQL || "";

    let html = `

        <div class="conversation-box">

            <h3>🤖 AI Assistant</h3>

            <p>${data.message.replace(/\n/g, "<br>")}</p>

        </div>

    `;
// ===================================
// Error Recovery
// ===================================
// ===================================
// Error Recovery
// ===================================

if (data.step === "ERROR_RECOVERY") {

    pendingExecution = true;

    document.getElementById("sql").innerText =
        data.recovery.sql || "";

    html = `

        <div class="conversation-box">

            <h2 style="color:orange;">

                🤖 AI Recovery Assistant

            </h2>

            <hr>

            <h3>

                ⚠ Problem Detected

            </h3>

            <p>

                ${data.message.replace(/\n/g,"<br>")}

            </p>

            <br>

            <h3>

                Suggested SQL Fix

            </h3>

            <pre style="background:#f5f5f5;padding:10px;border-radius:8px;white-space:pre-wrap;">

${data.recovery.sql}

            </pre>

            <br>

            <button onclick="executeRecovery()">

                ✅ Apply Fix

            </button>

            &nbsp;

            <button onclick="cancelSQL()">

                ❌ Cancel

            </button>

        </div>

    `;

    document.getElementById("result").innerHTML = html;

    return;

}
// ===================================
// Schema Confirmation
// ===================================

if (

    data.step === "CONFIRM_DROP_TABLE" ||

    data.step === "CONFIRM_DROP_COLUMN" ||

    data.step === "CONFIRM_TRUNCATE" ||

    data.step === "CONFIRM_RENAME_TABLE"

) {

    pendingExecution = true;

    document.getElementById("sql").innerText =
        data.generatedSQL || "";

    html = `

        <div class="conversation-box">

            <h2 style="color:red;">

                ⚠ AI Confirmation

            </h2>

            <hr>

            <p>

                ${data.message.replace(/\n/g,"<br>")}

            </p>

            <br>

            <h3>

                SQL To Execute

            </h3>

            <pre style="background:#f5f5f5;padding:10px;border-radius:8px;white-space:pre-wrap;">

${data.generatedSQL}

            </pre>

            <br>

            <button onclick="executeSQL()">

                ✅ Yes

            </button>

            &nbsp;

            <button onclick="cancelSQL()">

                ❌ No

            </button>

        </div>

    `;

    document.getElementById("result").innerHTML = html;

    return;

}
    // ===================================
    // SQL Preview
    // ===================================

    if (data.step === "PREVIEW") {

        pendingExecution = true;

        html += `

            <br>

            <button onclick="executeSQL()">

                ✅ Execute

            </button>

            <button onclick="cancelSQL()">

                ❌ Cancel

            </button>

        `;

        document.getElementById("result").innerHTML = html;

        return;

    }

    // ===================================
    // Text Input
    // ===================================

    if (
        data.step === "TABLE_NAME" ||
        data.step === "COLUMN_NAME"
    ) {

        html += `

            <br>

            <input
                type="text"
                id="conversationAnswer"
                placeholder="Type here">

            <br><br>

            <button onclick="continueConversation()">

                Next

            </button>

        `;

    }

    // ===================================
    // Option Buttons
    // ===================================

    else if (data.options) {

        html += "<br>";

        data.options.forEach(option => {

            html += `

                <button
                    onclick="continueConversation('${option}')">

                    ${option}

                </button>

                <br><br>

            `;

        });

    }

    document.getElementById("result").innerHTML = html;

}function renderConfirmation(data) {

    pendingExecution = true;

    document.getElementById("result").innerHTML = `

        <div class="conversation-box">

            <h3 style="color:red;">

                ⚠️ ${data.message}

            </h3>

            <br>

            <button onclick="executeSQL()">

                ✅ Execute

            </button>

            <button onclick="cancelSQL()">

                ❌ Cancel

            </button>

        </div>

    `;
}

function renderTable(data) {

    if (!data || data.length === 0) {

        document.getElementById("result").innerHTML = `
            <div class="success-card">
                No Data Found
            </div>
        `;

        return;

    }

    // Keep column order fixed
    const columns = Object.keys(data[0]);

    let html = `

        <div class="table-container">

        <table class="modern-table">

            <thead>

                <tr>

    `;

    columns.forEach(col => {

        html += `<th>${col}</th>`;

    });

    html += `

                </tr>

            </thead>

            <tbody>

    `;

    data.forEach(row => {

        html += "<tr>";

        columns.forEach(col => {

            html += `<td>${row[col] ?? ""}</td>`;

        });

        html += "</tr>";

    });

    html += `

            </tbody>

        </table>

        </div>

    `;

    document.getElementById("result").innerHTML = html;

}function renderError(message) {

    document.getElementById("result").innerHTML = `

        <div class="conversation-box">

            <h3 style="color:red;">

                ❌ ${message}

            </h3>

        </div>

    `;

}

// =====================================

async function executeSQL() {

    if (!pendingExecution) {

        return;

    }

    try {

        const response = await fetch("/api/execute", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            }

        });

    const data = await response.json();

// ======================================
// Recovery Conversation
// ======================================

if (data.conversation) {

    renderConversation(data);

    return;

}

// ======================================
// Normal Error
// ======================================

if (!data.success) {

    renderError(data.error || data.message);

    return;

}

    pendingExecution = false;

// Refresh the Database Explorer
loadDatabaseExplorer();

document.getElementById("sql").innerText =
    data.executedSQL || "";

document.getElementById("result").innerHTML = `
            <div class="conversation-box">

                <h3 style="color:green;">

                    ✅ ${data.message}

                </h3>

            </div>

        `;

    }

    catch (err) {

        console.error(err);

        renderError(err.message);

    }

}

// =====================================

function cancelSQL() {

    pendingExecution = false;

    document.getElementById("sql").innerText = "";

    document.getElementById("result").innerHTML = `

        <div class="conversation-box">

            <h3>

                ❌ Operation Cancelled

            </h3>

        </div>

    `;

}
async function continueConversation(answer = null) {

    // Read input only if no answer was passed
    if (answer === null) {

        const input = document.getElementById("conversationAnswer");

        if (!input) {

            alert("Please enter a value.");

            return;

        }

        answer = input.value.trim();

    }

    if (!answer) {

        alert("Please enter a value.");

        return;

    }

    try {

        const response = await fetch("/api/conversation", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                answer

            })

        });

        const data = await response.json();

        renderConversation(data);

    }

    catch (err) {

        console.error(err);

        alert(err.message);

    }

}
async function loadDatabaseExplorer() {

    try {

        const response = await fetch("/api/database");

        const data = await response.json();

        document.getElementById("databaseName").innerText =
            `Database : ${data.database}`;

        let html = `

            <div class="search-box">

                <input
                    type="text"
                    id="tableSearch"
                    placeholder="🔍 Search tables..."
                    onkeyup="filterTables()">

            </div>

        `;

        data.tables.forEach(table => {

            html += `

                <div
                    class="file-item"
                    data-name="${table.name.toLowerCase()}"
                    onclick="showTable('${table.name}')">

                    <div class="file-left">

                        <div class="file-icon">

                            📄

                        </div>

                        <div class="file-info">

                            <div class="file-name">

                                ${table.name}

                            </div>

                            <div class="file-meta">

    ${table.rows} rows • ${table.columns} columns

</div>

                        </div>

                    </div>

                    <div class="file-arrow">

                        ❯

                    </div>

                </div>

            `;

        });

        html += `

            <div class="table-count">

                ${data.tables.length} Tables Found

            </div>

        `;

        document.getElementById("databaseExplorer").innerHTML = html;

    }

    catch (err) {

        console.error(err);

    }

}

window.onload = function () {

    loadDatabaseExplorer();

};function showTable(tableName) {

    document.getElementById("question").value =
        `show all ${tableName}`;

    askAI();

}
async function executeRecovery() {

    try {

        const response = await fetch("/api/recovery", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            }

        });

        const data = await response.json();

        // ===============================
        // Recovery Failed
        // ===============================

        if (!data.success) {

            renderError(data.message || data.error);

            return;

        }

        // ===============================
        // Recovery Success
        // ===============================

        pendingExecution = false;

        document.getElementById("sql").innerText = "";

        document.getElementById("result").innerHTML = `

            <div class="conversation-box">

                <h2 style="color:limegreen;">

                    ✅ Recovery Successful

                </h2>

                <p>${data.message}</p>

            </div>

        `;

        // Refresh Database Explorer
        loadDatabaseExplorer();

    }

    catch (err) {

        console.error(err);

        renderError(err.message);

    }

}
function filterTables(){

    const keyword =
        document.getElementById("tableSearch")
        .value
        .toLowerCase();

    const files =
        document.querySelectorAll(".file-item");

    files.forEach(file=>{

        const name =
            file.dataset.name;

        if(name.includes(keyword)){

            file.style.display="flex";

        }

        else{

            file.style.display="none";

        }

    });

}