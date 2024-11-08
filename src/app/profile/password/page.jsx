import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "../../components/navbar/Navbar";
import TabBar from "../../components/tabBar/TabBar";
import styles from "./styles.module.scss";
import Form from "./Form";

export default function Page() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/register");
  }

  const { user } = JSON.parse(atob(session.value.split(".")[1]));
  const userId = user.user_id;

  return (
    <div>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.mainLabel}>Şifre Değiştir</div>
        <Form userId={userId} />
      </main>
      <TabBar />
    </div>
  );
}
