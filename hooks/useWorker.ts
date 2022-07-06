import { Optional } from "interface/types";
import { useCallback, useEffect, useRef, useState } from "react";

enum WORKER_STATUS {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  RUNNING = "RUNNING",
  ERROR = "ERROR",
  TIMEOUT_EXPIRED = "TIMEOUT_EXPIRED",
}

type TUseWorker = {
  code: string;
  onMessage?: Function;
  onError?: Function;
};

const createBlobObjectURL = (code: string): string => {
  const blob = new Blob([`${code}`], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  return url;
};

export const useWorker = <T>({ code, onMessage, onError }: TUseWorker) => {
  const workerRef = useRef<Optional<Worker>>(null);
  const onMessageRef = useRef<Function>();
  const onErrorRef = useRef<Function>();

  const [data, setData] = useState<Optional<T>>(null);
  const [status, setStatus] = useState<WORKER_STATUS>(WORKER_STATUS.PENDING);
  const [error, setError] = useState<Optional<string>>(null);

  const handleMessage = (e: MessageEvent) => {
    onMessageRef.current?.();
    setData(e.data);
    setStatus(WORKER_STATUS.SUCCESS);
  };

  const handleError = (e: ErrorEvent) => {
    onErrorRef.current?.();
    setError(e.message);
    setStatus(WORKER_STATUS.ERROR);
  };

  const postMessage = useRef((message: T) => {
    if (workerRef.current) {
      workerRef.current.postMessage(message);
      setStatus(WORKER_STATUS.RUNNING);
    }
  });

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    let worker = workerRef.current;

    // create new worker
    if (!worker) {
      const url = createBlobObjectURL(code);
      worker = new Worker(url);
      workerRef.current = worker;
    }

    worker.addEventListener("message", handleMessage);
    worker.addEventListener("error", handleError);

    return () => {
      worker?.removeEventListener("message", handleMessage);
      worker?.removeEventListener("error", handleError);
      worker?.terminate();
    };
  }, [code]);

  // terminate
  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return {
    postMessage: postMessage.current,
    data,
    loading:
      status === WORKER_STATUS.PENDING || status === WORKER_STATUS.RUNNING,
    error,
  };
};
