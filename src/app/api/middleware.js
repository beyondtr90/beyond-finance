import { updateSession } from "./auth/route";

export async function middleware(request) {
  return await updateSession(request);
}
