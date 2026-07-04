import "./Intro.css";
import MeshAIIcon from "../../assets/MeshAI-Icon.png";
import CardIcon1 from "../../assets/Card-Icon1.png";
import CardIcon2 from "../../assets/Card-Icon2.png";
import CardIcon3 from "../../assets/Card-Icon3.png";
import { useNavigate } from "react-router-dom";


export default function Intro() {
    const navigate = useNavigate();

    return (
    <div className="intro">
        <div className="intro__header">
            <h1 className="intro__header-text">Welcome to Mesh AI</h1>
            <img className="intro__header-img" src={MeshAIIcon}></img>
        </div>
        <div className="card-container">
            <div className="card">
                <img className="card__icon" src={CardIcon1}></img>
                <p className="card__text">Bring all your documents into one secure AI workspace</p>
            </div>
            <div className="card">
                <img className="card__icon" src={CardIcon2}></img>
                <p className="card__text">Organize and manage the documents that power your AI</p>
            </div>
            <div className="card">
                <img className="card__icon" src={CardIcon3}></img>
                <p className="card__text">Your knowledge base accessible from a simple chat interface</p>
            </div>
        </div>
        <p className="intro__description-text">Start by creating your Organization's Knowledge Base</p>
        <button 
        className="intro__start-btn"
        onClick={() => navigate("/knowledge")}>
            Start
        </button>
    </div>
    );
}