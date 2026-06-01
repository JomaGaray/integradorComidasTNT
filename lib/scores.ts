export function gradeColor(grade: string): string {
  switch (grade.toUpperCase()) {
    case 'A+':
    case 'A':
      return '#2E8B3D'; // verde oscuro
    case 'B+':
    case 'B':
      return '#7DB544'; // verde claro
    case 'C':
      return '#F2A900'; // ámbar
    case 'D':
      return '#E8722B'; // naranja
    case 'E':
      return '#D64541'; // rojo
    default:
      return '#9AA0A6'; // gris (desconocido)
  }
}

export function novaColor(group: 1 | 2 | 3 | 4): string {
  switch (group) {
    case 1:
      return '#F2C200';
    case 2:
      return '#F2A900';
    case 3:
      return '#E8722B';
    case 4:
      return '#D64541';
  }
}