import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export const Navbar: FC = () => {
  return(
    <div className="navbar navbar-default navbar-fixed-top headroom headroom--not-bottom headroom--pinned headroom--top">
      <div className="container">
        <div className="navbar-header">
          <span className="navbar-brand">
            <a className="navbar-link">alloviewer</a>
          </span>
        </div>

      <div id="navbar" className="navbar-collapse collapse">
        <ul className="nav navbar-nav">
          <li>
            <a href="./">Models</a>
          </li>
          <li>
            <a href="./publications.html">Publications</a>
          </li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li>
            <a href="https://github.com/allometric/allometric/" className="external-link">
              <FontAwesomeIcon icon={faGithub} style={{height: "20px"}} />
            </a>
          </li></ul>
        </div>
      </div>
    </div>
  )
}