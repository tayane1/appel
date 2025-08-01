import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // Ici on pourrait ajouter un service de loading global
  // Pour l'instant, on retourne simplement la requête
  return next(req).pipe(
    finalize(() => {
      // Logique de fin de chargement
    })
  );
}; 