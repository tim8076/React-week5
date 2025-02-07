import ReactLoading from 'react-loading';
export default function TheLoader({ type, color, isLoading }) {
  return (
    isLoading && (
      <div className="position-fixed top-0 start-0 end-0 bottom-0 d-flex justify-content-center align-items-center"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
        <ReactLoading type={type} color={color} height={150} width={60} />
      </div>
    )
  )
}
