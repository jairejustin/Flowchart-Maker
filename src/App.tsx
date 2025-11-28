import './App.css'
import CanvasPage from './pages/canvas_page/CanvasPage';
import { mockFlowDocument } from "./assets/MockData";

export default function App() {
    return (
        <div id="app">
            <CanvasPage
                flowDocument={mockFlowDocument}
             />
        </div>
    );
}