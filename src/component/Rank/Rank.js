import React from "react";

const Rank = ({loadedUserName, loadedUserEntries}) =>{
    return(
        <div>
            <div className="white f3">
                {`${loadedUserName}, your current entry count is ... `}
            </div>
            <div className="white f1">
                {`${loadedUserEntries}`}
            </div>
        </div>
    )
}

export default Rank;