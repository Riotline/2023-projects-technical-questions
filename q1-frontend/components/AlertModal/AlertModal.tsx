import { SetStateAction, Dispatch, FormEvent } from "react";
import { TableContents } from "../Table/Table";

interface AlertModalProps {
  UseContents: Dispatch<SetStateAction<TableContents>>,
}

// Running in dev causes setState to fire twice (I'm guessing due to strict)
export default function AlertModal({UseContents}: AlertModalProps) {
  function onSubmitEvent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // hint: the alert given is at (e.target as any).elements[0].value - ignore typescript being annoying
    UseContents(content => {
        content.rowContents.push(
        {
          alert: (e.target as any).elements[0].value,
          status: 'unknown',
          updates: []
        });
        console.log(content);
        return {...content};
      }
    );
  }

  return (
    <form data-testid='form' onSubmit={onSubmitEvent}>
      <label> Add new alert: </label>
      <input type='text' id='alert' name='alert' />
      <button type='submit'> Add </button>
    </form>
  )
}
