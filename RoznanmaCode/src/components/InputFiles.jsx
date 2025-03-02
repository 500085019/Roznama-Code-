import React , {useRef} from "react";
export const InputField = ({ 
    label, 
    id, 
    name, 
    type = "text", 
    placeholder, 
    onChange, 
    value ,
    showDate = false
  }) => {
    const labelStyles = {
      fontSize: "16px",
      fontWeight: "500",
      color: "#333",
      marginBottom: "8px",
    };
  
    const inputStyles = {
      padding: "12px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "16px",
      color: "#333",
    };
    const inputRef = useRef(null);

    const handleIconClick = () => {
      
      inputRef.current.click();
    };
  
    return (
      <div className="mt-4 text-start">
        <label htmlFor={id} className="form-label" style={labelStyles}>
          {label}
        </label>
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          showDate={showDate}
          className="form-control"
          style={inputStyles}
        />
        {showDate && (
          <div className="input-group-append"
          style = {{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
          }}>
            

            <span className="input-group-text" onClick={handleIconClick}>
  📅
</span>
          </div>
        )}
        
      </div>
      
  

    
    );
  };