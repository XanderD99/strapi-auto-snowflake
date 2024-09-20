const PluginIcon = () => {
  return (
    <svg
      fill="#000000"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      id="snow"
      data-name="Line Color"
      xmlns="http://www.w3.org/2000/svg"
      className="icon line-color"
    >
      <path
        id="primary"
        d="M3,12H21M12,3V21"
        style={{
          fill: 'none',
          stroke: '#fff',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: 2,
        }}
      />
      <polyline
        id="secondary"
        points="19 9 17 12 19 15"
        style={{
          fill: 'none',
          stroke: '#2CA9BC',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: 2,
        }}
      />
      <polyline
        id="secondary-2"
        data-name="secondary"
        points="5 15 7 12 5 9"
        style={{
          fill: 'none',
          stroke: '#2CA9BC',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: 2,
        }}
      />
      <polyline
        id="secondary-3"
        data-name="secondary"
        points="15 19 12 17 9 19"
        style={{
          fill: 'none',
          stroke: '#2CA9BC',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: 2,
        }}
      />
      <polyline
        id="secondary-4"
        data-name="secondary"
        points="9 5 12 7 15 5"
        style={{
          fill: 'none',
          stroke: '#2CA9BC',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: 2,
        }}
      />
    </svg>
  );
};

export { PluginIcon };
