import React from 'react';

const Index = () => {
    const [state,setState] = React.useState(0)
    return (
        <div>
            hello {state}
        </div>
    );
};

export default Index;
