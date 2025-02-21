import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toast as BsToast } from "bootstrap";
import { removeMeaasge } from "../slice/toastSlice";

export default function Toast() {
  const messages = useSelector(state => state.toast.messages);
  const toastRefs = useRef({});
  const dispatch = useDispatch();
  const TOAST_DURATION = 2000;
  useEffect(() => {
    messages.forEach((message) => {
      const toastElement = toastRefs.current[message.id];
      if (toastElement) {
        const toastInstance = new BsToast(toastElement);
        toastInstance.show();
        setTimeout(() => {
          dispatch(removeMeaasge(message.id));
        }, TOAST_DURATION);
      }
    })
  }, [messages, dispatch]);

  const handleDissmiss = (messageId) => {
    dispatch(removeMeaasge(messageId));
  }

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 10000 }}>
      {messages.map(message => {
        return (
          <div className="toast" role="alert" aria-live="assertive" aria-atomic="true"
            key={message.id}
            ref={(el) => toastRefs.current[message.id] = el}>
            <div className={`toast-header text-white ${message.status === 'success' ? 'bg-success' : 'bg-danger'}`}>
              <strong className="me-auto">
                { message.status === 'success' ? '成功' : '失敗' }
              </strong>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => handleDissmiss(message.id)}
              ></button>
            </div>
            <div className="toast-body">{message.text}</div>
          </div>
        )
      })}
    </div>
  )
}
