import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { capitalizeFirstLetter } from "../../../../config/util";


export default function AlertDialog(props) {

  const handleClose = async (confirmDelete) => {
    if (props.delete) await props.deletarProjeto({ id: props.projeto.id, nome: props.projeto.nome }, confirmDelete)
    else await props.finalizarProjeto({ id: props.projeto.id, nome: props.projeto.nome }, confirmDelete)
  };

  return (
    <div>
      <Dialog
        open={true}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Tem certeza?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`${capitalizeFirstLetter(props.projeto.nome)} ${props.delete ? `será excluído para sempre!` : 'será marcado como finalizado'}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(true)} color="primary" autoFocus>
            Sim
          </Button>
          <Button onClick={() => handleClose(false)} color="secondary">
            Não
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

AlertDialog.defaultProps = {
  show: true, projeto: {
    nome: '',
    id: ''
  }
};
