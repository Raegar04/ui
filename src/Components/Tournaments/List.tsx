import { FormEvent, Fragment, SyntheticEvent, useEffect, useState } from "react";
import { Status, Tournament } from "../../models";
import { base_URL, base_GUID } from "../../Api/api";
import "../TablesStyles.css"
import { NavLink } from "react-router-dom";
import { create } from "domain";

const endPoint: string = "Tournament/";

export function TournamentList() {
    const [tournaments, setTournaments] = useState<Array<Tournament>>([]);
    const [showForCreate, setShowForCreate] = useState<boolean>(false);
    const [showForUpdate, setShowForUpdate] = useState<string>("");
    const [created, setCreated] = useState<Tournament>({ Id: base_GUID, Name: '', Description: '', Scope: 0, StartDate: new Date(), Status: Status.Planned });
    // const [detail, setDetail] = useState<Tournament>();
    const [updated, setUpdated] = useState<Tournament>({ Id: base_GUID, Name: '', Description: '', Scope: 0, StartDate: new Date(), Status: Status.Planned });
    const [logMessage, setLogMessage] = useState<string>("");

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

    function FetchTournaments(ignore: boolean) {
        fetch(base_URL + endPoint + "Display", { method: "GET" }).then(async response => {
            const tournaments: Array<Tournament> = await response.json();
            if (!ignore) {
                setTournaments(tournaments);
            }
        });
    }

    useEffect(() => {
        let ignore = false;

        FetchTournaments(ignore);

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

    // async function OnDetailsHandler(id: string) {
    //     await fetch(base_URL + endPoint + "Details/" + id, { method: "GET" }).then(response => response.json()).then(data => { setDetail(data) });
    //     BlockBody();
    //     EnableDp();
    // }

    async function OnDeleteHandler(id: string) {
        await fetch(base_URL + endPoint + "Delete/" + id, { method: "DELETE" }).then(response => response.text()).then(data => {
            FetchTournaments(false);
            console.log(data);
        });
    }

    async function OnCreateHandler() {
        var response = await fetch(base_URL + endPoint + "Create", { method: "POST", headers: { "Content-type": "application/json" }, body: JSON.stringify(created) });

        if (response.ok) {
            FetchTournaments(false);
            setShowForCreate(false);
            NormallizeBody();
        }
        else{
            var data = await response.text();
            setLogMessage(data);
        }
    }


    async function OnUpdateHandler() {
        var response = await fetch(base_URL + endPoint + "Update/" + showForUpdate, { method: "PUT", headers: { "Content-type": "application/json" }, body: JSON.stringify(updated) });
        // .then(response => response.json()).then(data => {

        //     console.log(data.message);
        // });

        if (response.ok) {
            FetchTournaments(false);
        setShowForUpdate("");
        NormallizeBody();
        }
        else{
            var data = await response.text();
            setLogMessage(data);
        }
    }

    return (
        <div className="App container">
            <button onClick={() => OnShowCreatedHandler()} className="btn btn-success">Create Tournament</button><br /><br />
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Scope</th>
                        <th>Start Date</th>
                        <th>Status</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {tournaments.map(tournament =>
                        <Fragment key={tournament.Id}>
                            <tr className="entity-columns">
                                <td>{tournament.Name}</td>
                                <td>{tournament.Description}</td>
                                <td>{tournament.Scope}</td>
                                <td>{tournament.StartDate.toString()}</td>
                                <td>{tournament.Status}</td>
                                <td>
                                    <NavLink className='btn btn-info btn-options' to={`/${tournament.Id}/Round`}>Rounds</NavLink>
                                    <button onClick={() => OnShowUpdatedHandler(tournament.Id)} className="btn btn-primary btn-options">Update</button>
                                    <button onClick={() => OnDeleteHandler(tournament.Id)} className="btn btn-danger">Delete</button>
                                </td>
                            </tr>
                        </Fragment>

                    )}
                </tbody>
            </table>

            <div id="dpContainer">
                {/* {detail == undefined ? null :
                    <div className="dropdown-container">
                        <h2>Tournament details</h2><br />
                        <h3 style={{ textAlign: "left" }}>{detail.Name}</h3>
                        <p style={{ textAlign: "left" }}>Description: {detail.Description}</p>
                        <div className="dpOptions">
                            
                            <button onClick={() => {
                                NormallizeBody();
                                setDetail(undefined);
                            }} className="btn btn-danger">Close</button>
                        </div>
                    </div>} */}

                {showForUpdate == "" ? null :
                    <div className="dropdown-container">
                        <label>Name: <input type="text" value={updated.Name} onChange={(e) => setUpdated({ ...updated, Name: e.target.value })} /></label>
                        <label>Description: <input type="text" value={updated.Description} onChange={(e) => setUpdated({ ...updated, Description: e.target.value })} /></label>
                        <label>Scope: <input type="number" value={updated.Scope.toString()} onChange={(e) => setUpdated({ ...updated, Scope: e.target.valueAsNumber })} /></label>
                        <label>Start date: <input type="date" placeholder={updated.StartDate.toString()} onChange={(e) => setUpdated({ ...updated, StartDate: new Date(e.target.value) })} /></label>
                        <label>Status:
                            <select onChange={(e) => setUpdated({ ...updated, Status: Status[e.target.value as keyof typeof Status] })}>
                                <option value={Status.Planned}>{updated == undefined ? 'Select status' : updated.Status.toString()}</option>
                                <option value={Status.Planned}>Запланирован</option>
                                <option value={Status.Process}>В процессе</option>
                                <option value={Status.Ended}>Завершен</option>
                            </select>
                        </label>
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
                        <label>Scope: <input type="number" onChange={(e) => setCreated({ ...created, Scope: e.target.valueAsNumber })} /></label>
                        <label>Start date: <input type="date" onChange={(e) => setCreated({ ...created, StartDate: new Date(e.target.value) })} /></label>
                        <label>Status:
                            <select onChange={(e) => setCreated({ ...created, Status: Status[e.target.value as keyof typeof Status] })}>
                                <option value={Status.Planned}>Запланирован</option>
                                <option value={Status.Process}>В процессе</option>
                                <option value={Status.Ended}>Завершен</option>
                            </select>
                        </label>
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