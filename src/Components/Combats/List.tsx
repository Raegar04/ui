import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Combat, CombatType } from "../../models";
import { base_GUID, base_URL } from "../../Api/api";

const endPoint:string = "Combat/";

export function CombatsList() {
    const { tournamentId, roundId } = useParams();
    const [combats, setCombats] = useState<Array<Combat>>([]);
    const [showForCreate, setShowForCreate] = useState<boolean>(false);
    const [showForUpdate, setShowForUpdate] = useState<string>("");
    const [created, setCreated] = useState<Combat>({ Id: base_GUID, StartDate: new Date(), EndDate: new Date(), Type:CombatType.OnSwords });
    const [updated, setUpdated] = useState<Combat>({ Id: base_GUID, StartDate: new Date(), EndDate: new Date(), Type:CombatType.OnSwords });
    const [logMessage, setLogMessage] = useState<string>("");

    const tournamentIdQueryParam = `?tournamentId=${tournamentId}`;
    const roundIdQueryParam = `?roundId=${roundId}`;

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

    function FetchCombats(ignore: boolean) {
        fetch(base_URL + endPoint + "Display" + roundIdQueryParam, { method: "GET" }).then(async response => {
            const combats: Array<Combat> = await response.json();
            if (!ignore) {
                setCombats(combats);
            }
        });
    }

    useEffect(() => {
        let ignore = false;

        FetchCombats(ignore);

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
            FetchCombats(false);
            console.log(data);
        });
    }

    async function OnCreateHandler() {
        var response = await fetch(base_URL + endPoint + "Create" + roundIdQueryParam, { method: "POST", headers: { "Content-type": "application/json" }, body: JSON.stringify(created) });

        if (response.ok) {
            FetchCombats(false);
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
            FetchCombats(false);
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
            <button onClick={() => OnShowCreatedHandler()} className="btn btn-success">Create Combat</button><br /><br />
            <table className="table">
                <thead>
                    <tr>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Combat Type</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    {combats.map(combat =>
                        <Fragment key={combat.Id}>
                            <tr>
                                <td>{combat.StartDate.toString()}</td>
                                <td>{combat.EndDate.toString()}</td>
                                <td>{combat.Type}</td>
                                <td>
                                    <button onClick={() => OnShowUpdatedHandler(combat.Id)} className="btn btn-primary btn-options">Update</button>
                                    <button onClick={() => OnDeleteHandler(combat.Id)} className="btn btn-danger">Delete</button>
                                </td>
                            </tr>
                        </Fragment>
                    )}
                </tbody>
            </table>

            <div id="dpContainer">

                {showForUpdate == "" ? null :
                    <div className="dropdown-container">
                        <label>Start date: <input type="date" placeholder={updated.StartDate.toString()} onChange={(e) => setUpdated({ ...updated, StartDate: new Date(e.target.value) })} /></label>
                        <label>End date: <input type="date" placeholder={updated.EndDate.toString()} onChange={(e) => setUpdated({ ...updated, EndDate: new Date(e.target.value) })} /></label>
                        <label>Combat Type:
                            <select onChange={(e) => setUpdated({ ...updated, Type: CombatType[e.target.value as keyof typeof CombatType] })}>
                                <option defaultValue={updated.Type}>{updated.Type}</option>
                                <option value={CombatType.FieldBattle}>Field Battle</option>
                                <option value={CombatType.OnSwords}>On Swords</option>
                                <option value={CombatType.BetweenArchers}>Archers</option>
                                <option value={CombatType.HandToHand}>Hand to hand</option>
                                <option value={CombatType.WithHorses}>On horses</option>
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
                        <label>Start Date: <input type="date" onChange={(e) => setCreated({ ...created, StartDate: new Date(e.target.value)  })} /></label>
                        <label>End Date: <input type="date" onChange={(e) => setCreated({ ...created, EndDate: new Date(e.target.value) })} /></label>
                        <label>Combat Type:
                        <select onChange={(e) => setUpdated({ ...updated, Type: CombatType[e.target.value as keyof typeof CombatType] })}>
                                <option defaultValue={CombatType.OnSwords}>Select value</option>
                                <option value={CombatType.FieldBattle}>Field Battle</option>
                                <option value={CombatType.OnSwords}>On Swords</option>
                                <option value={CombatType.BetweenArchers}>Archers</option>
                                <option value={CombatType.HandToHand}>Hand to hand</option>
                                <option value={CombatType.WithHorses}>On horses</option>
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