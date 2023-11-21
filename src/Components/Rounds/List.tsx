import { Fragment, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Round } from "../../models";
import { base_GUID, base_URL } from "../../Api/api";
import "../TablesStyles.css";

const endPoint:string = "Round/";

export function RoundsList() {
    const { tournamentId } = useParams();
    const [rounds, setRounds] = useState<Array<Round>>([]);
    const [showForCreate, setShowForCreate] = useState<boolean>(false);
    const [showForUpdate, setShowForUpdate] = useState<string>("");
    const [created, setCreated] = useState<Round>({ Id: base_GUID, Name: '', Description: '', StartDate: new Date(), EndDate: new Date() });
    const [updated, setUpdated] = useState<Round>({ Id: base_GUID, Name: '', Description: '', StartDate: new Date(), EndDate: new Date() });
    const [logMessage, setLogMessage] = useState<string>("");

    const tournamentIdQueryParam = `?tournamentId=${tournamentId}`;

    function NormallizeBody(): void {
        var body = document.getElementsByTagName("body")[0];
        body.style.pointerEvents = "auto";
        setLogMessage("");
    }

    function BlockBody(): void {
        var body = document.getElementsByTagName("body")[0];
        body.style.pointerEvents = "none";
    }

    function EnableDp() {
        const dpContainer = document.getElementById("dpContainer");
        if (dpContainer != undefined) {
            dpContainer.style.pointerEvents = "auto";
        }
    }

    function FetchRounds(ignore: boolean) {
        fetch(base_URL + endPoint + "Display" + tournamentIdQueryParam, { method: "GET" }).then(async response => {
            const rounds: Array<Round> = await response.json();
            if (!ignore) {
                setRounds(rounds);
            }
        });
    }

    useEffect(() => {
        let ignore = false;

        FetchRounds(ignore);

        return () => {
            ignore = true;
            NormallizeBody();
        };
    }, []);

    function OnShowCreatedHandler() {
        setShowForCreate(true);
        BlockBody();
        EnableDp();
    }

    async function OnShowUpdatedHandler(id: string) {
        var data = await fetch(base_URL + endPoint + "Details/" + id, { method: "GET" }).then(response => response.json());
        setUpdated(data);
        setShowForUpdate(id);
        BlockBody();
        EnableDp();
    }

    async function OnDeleteHandler(id: string) {
        await fetch(base_URL + endPoint + "Delete/" + id, { method: "DELETE" }).then(response => response.text()).then(data => {
            FetchRounds(false);
            console.log(data);
        });
    }

    async function OnCreateHandler() {
        var response = await fetch(base_URL + endPoint + "Create" + tournamentIdQueryParam, { method: "POST", headers: { "Content-type": "application/json" }, body: JSON.stringify(created) });

        if (response.ok) {
            FetchRounds(false);
            setShowForCreate(false);
            NormallizeBody();
        }
        else {
            var data = await response.text();
            setLogMessage(data);
        }
    }


    async function OnUpdateHandler() {
        var response = await fetch(base_URL + endPoint + "Update/" + showForUpdate, { method: "PUT", headers: { "Content-type": "application/json" }, body: JSON.stringify(updated) });
        if (response.ok) {
            FetchRounds(false);
            setShowForUpdate("");
            NormallizeBody();
        }
        else {
            var data = await response.text();
            setLogMessage(data);
        }
    }

    return (
        <div className="App container">
            <button onClick={() => OnShowCreatedHandler()} className="btn btn-success">Create Round</button><br /><br />
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {rounds.map(round =>
                        <Fragment key={round.Id}>
                            <tr>
                                <td>{round.Name}</td>
                                <td>{round.Description}</td>
                                <td>{round.StartDate.toString()}</td>
                                <td>{round.EndDate.toString()}</td>
                                <td>
                                    <NavLink className='btn btn-info btn-options' to={`/${tournamentId}/${round.Id}/Combat`}>Combats</NavLink>
                                    <button onClick={() => OnShowUpdatedHandler(round.Id)} className="btn btn-primary btn-options">Update</button>
                                    <button onClick={() => OnDeleteHandler(round.Id)} className="btn btn-danger">Delete</button>
                                </td>
                            </tr>
                        </Fragment>
                    )}
                </tbody>
            </table>

            <div id="dpContainer">

                {showForUpdate == "" ? null :
                    <div className="dropdown-container">
                        <label>Name: <input type="text" value={updated.Name} onChange={(e) => setUpdated({ ...updated, Name: e.target.value })} /></label>
                        <label>Description: <input type="text" value={updated.Description} onChange={(e) => setUpdated({ ...updated, Description: e.target.value })} /></label>
                        <label>Start date: <input type="date" placeholder={updated.StartDate.toString()} onChange={(e) => setUpdated({ ...updated, StartDate: new Date(e.target.value) })} /></label>
                        <label>End date: <input type="date" placeholder={updated.EndDate.toString()} onChange={(e) => setUpdated({ ...updated, EndDate: new Date(e.target.value) })} /></label>
                        <label className="log">{logMessage}</label>
                        <div>
                            <button style={{ marginRight: '20px' }} className="btn btn-success" type="button" onClick={() => OnUpdateHandler()}>Update</button>
                            <button type="button" onClick={() => {
                                NormallizeBody();
                                setShowForUpdate("");
                            }} className="btn btn-danger">Close</button>
                        </div>

                    </div>}

                {showForCreate == false ? null :
                    <div className="dropdown-container">
                        <label>Name: <input type="text" onChange={(e) => setCreated({ ...created, Name: e.target.value })} /></label>
                        <label>Description: <input type="text" onChange={(e) => setCreated({ ...created, Description: e.target.value })} /></label>
                        <label>Start date: <input type="date" onChange={(e) => setCreated({ ...created, StartDate: new Date(e.target.value) })} /></label>
                        <label>end date: <input type="date" onChange={(e) => setCreated({ ...created, EndDate: new Date(e.target.value) })} /></label>
                        <label className="log">{logMessage}</label>
                        <div>
                            <button style={{ marginRight: '20px' }} className="btn btn-success" type="button" onClick={() => OnCreateHandler()}>Create</button>
                            <button type="button" onClick={() => {
                                NormallizeBody();
                                setShowForCreate(false);
                            }} className="btn btn-danger">Close</button>
                        </div>
                    </div>}
            </div>
        </div>
    );
}