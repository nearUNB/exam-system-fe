import "./CustomTable.css";

export default function CustomTable({ headers = [], children }) {
  return (
    <div className="table-wrapper">
      <table className="custom-table">
        {headers.length > 0 && (
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

