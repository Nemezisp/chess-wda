import PlayPage from "../playPage/playPage.component"
import LocalPieceSelection from "../localPieceSelection/localPieceSelection.component";
import { selectBoardReady } from "../../redux/selectors";
import { useSelector } from "react-redux";

const LocalMode = () => {
    const isBoardReady = useSelector(selectBoardReady)

    return (
        isBoardReady ? <PlayPage/> : <LocalPieceSelection/>
    )
}

export default LocalMode;