import { MatrixOrganismMap } from "./matrix-organism-map";
import { commentOrganismMapTests } from "./organism-map-common-tests";

commentOrganismMapTests('MatrixOrganismMap', () => new MatrixOrganismMap(100, 100));