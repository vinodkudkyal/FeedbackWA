const SessionStatus = ({ isActive, message, isLoading }) => {
    if (isLoading) return <div>Checking session status...</div>;
    return (
      <div className={`${isActive ? 'text-green-600' : 'text-red-600'}`}>
        {message}
      </div>
    );
  };