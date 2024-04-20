import React from 'react';
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const YourApiDocumentationComponent: React.FC = () => {
  return (
    <div>
      <div className="box">
        Welcome to the Developer Portal! This is very much a work in progress, but Developer Portals in general are places where there's documentation to help somewhat technical people do things with systems that would be tricky to do with just standard user interfaces(Though there's a lot more to it and I'm very much not an expert).
      </div>

      <SwaggerUI url="DriveDashAPI.yaml" />



      <div className="challenge">
          <p className='challenge-title' >Challenge:</p>
          <p>
          From your browser URL bar, try to hit an API endpoint on the backend (port 3000 if you haven't changed the project default settings). The result should look something {'{ \'like\': \'this\' }'}
          </p>
        </div>

    </div>
    
  );
};

export default YourApiDocumentationComponent;