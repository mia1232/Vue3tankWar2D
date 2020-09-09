import {
  h,
  defineComponent,
  toRefs
} from "@vue/runtime-core";
import { useFighting } from "../state/FightMechanismState"; 
import { useEnvironmentInteraction, useBackgrounds } from "../state/EnvState";
import { useCreateTank, useCreateEnemyTank, useCreateBullets, useInvunerableBuff }from "../state/GameState";
import Steels from "../component/Steels";
import Tank from "../component/Tank";
import EnemyTank from "../component/EnemyTank";
import EnemyTank2 from "../component/EnemyTank2";
import Bullet from "../component/Bullet";
import EnemyBullet from "../component/EnemyBullet";
import InvunerableBuff from "../component/InvulnerableBuff";
import { backgroundAudio } from "../gameaudio/audioUtil";
import { enemyTankGeneratorStart } from "../tank-ai/tank-generator"; 
import { environmentRuleHasCollision } from "../utils/index";
import audioPath from '../gameaudio/battlemusickurenai.m4a';
import { parseInitEnvDataToGameWorld } from "../utils/envParser";
import Water from "../component/Water";
import Grass from "../component/Grass";
import Walls from "../component/Walls";

export default defineComponent({
  props: ["level", "setup", "enemySpawningSetup"],
  setup(props, { emit }) {
    const bgMusic = new backgroundAudio(audioPath);
    bgMusic.play();
    const { level, setup, enemySpawningSetup } = toRefs(props);

    const {
      SteelBlocksArr: SteelIntialData,
      GrassBlocksArr: GrassInitialData,
      InvunerableBuffsArr: InvunerableBuffInitialData,
      WallsBlockArr: WallsInitialData,
      WaterBlockArr: WaterInitialData,
      EnemyBasicTankArr: enemyInitialData,
      EnemyTankType2Arr: enemyType2InitialData,
      Player: PlayerInitialData
    } = parseInitEnvDataToGameWorld(setup.value);

    const { enemyTanks } = useCreateEnemyTank(enemyInitialData);

    const { enemyTanks: enemyTanksType2 } = useCreateEnemyTank(
      enemyType2InitialData
    );

    const WallsBlocks = useBackgrounds(WallsInitialData);
    const SteelBlocks = useBackgrounds(SteelIntialData);
    const { tankInfo } = useCreateTank(
      PlayerInitialData,
      environmentRuleHasCollision,
      {
        SteelBlocks,
        WallsBlocks
      }
    );

    const WaterBlocks = useBackgrounds(WaterInitialData);

    const GrassBlocks = useBackgrounds(GrassInitialData);


    const InvulnerableBuffs = useInvunerableBuff(InvunerableBuffInitialData);

    // 我方子弹
    const { bullets, addBullet } = useCreateBullets();
    const {
      bullets: enemyBullets,
      addBullet: addEnemyBullet
    } = useCreateBullets();


    enemyTankGeneratorStart({
      SteelBlocks,
      WallsBlocks
    }, enemyTanks, enemyTanksType2, enemySpawningSetup.value);
    
    useFighting(
      bgMusic,
      level.value,
      enemyTanks,
      enemyTanksType2,
      bullets,
      enemyBullets,
      tankInfo,
      emit,
      {
        SteelBlocks,
        WallsBlocks
      },
      InvulnerableBuffs
    );
    useEnvironmentInteraction(
      tankInfo,
      environmentRuleHasCollision,
      enemyTanks,
      enemyTanksType2,
      {
        SteelBlocks,
        WallsBlocks
      }
    );

    const onAttack = bulletInfo => {
      // 本方坦克发射子弹
      addBullet(bulletInfo);
    };

    const onEnemyAttack = bulletInfo => {
      // 敌方坦克发射子弹
      addEnemyBullet(bulletInfo);
    };

    return {
      onAttack,
      onEnemyAttack,
      enemyTanks,
      enemyTanksType2,
      enemyBullets,
      bullets,
      tankInfo,
      SteelBlocks,
      WaterBlocks,
      GrassBlocks,
      WallsBlocks,
      InvulnerableBuffs
    };
  },

  render(ctx) {
    const createEnemyTanks = onEnemyAttack => {
      return ctx.enemyTanks.map(info => {
        return h(EnemyTank, {
          status: info.status,
          x: info.x,
          y: info.y,
          health: info.health,
          direction: info.direction,
          onAttack: onEnemyAttack
        });
      });
    };

    const createEnemyTanksType2 = onEnemyAttack => {
      return ctx.enemyTanksType2.map(info => {
        return h(EnemyTank2, {
          status: info.status,
          x: info.x,
          y: info.y,
          health: info.health,
          direction: info.direction,
          onAttack: onEnemyAttack
        });
      });
    };

    const createBullets = () => {
      return ctx.bullets.map(info => {
        return h(Bullet, { 
          x: info.x, 
          y: info.y, 
          direction: info.direction });
      });
    };

    const createEnemyBullets = () => {
      return ctx.enemyBullets.map(info => {
        return h(EnemyBullet, {
          x: info.x,
          y: info.y,
          direction: info.direction
        });
      });
    };

    const createBackgroundBlocks = (backgroundInitData, backgroundType) => {
      return backgroundInitData.map(info => {
        return h(backgroundType, { x: info.x, y: info.y });
      });
    };


    const createInvunerableBuffs = InvunerableBuffs => {
      return InvunerableBuffs.map(info => {
        return h(InvunerableBuff, { x: info.x, y: info.y });
      });
    };


    return h("Container", [
      h(Tank, {
        x: ctx.tankInfo.x,
        y: ctx.tankInfo.y,
        direction: ctx.tankInfo.direction,
        onAttack: ctx.onAttack,
        status: ctx.tankInfo.status
      }),
      ...createEnemyTanks(ctx.onEnemyAttack),
      ...createEnemyTanksType2(ctx.onEnemyAttack),
      ...createBullets(),
      ...createInvunerableBuffs(ctx.InvulnerableBuffs),
      ...createEnemyBullets(),
      ...createBackgroundBlocks(ctx.SteelBlocks, Steels),
      ...createBackgroundBlocks(ctx.WaterBlocks, Water),
      ...createBackgroundBlocks(ctx.GrassBlocks, Grass),
      ...createBackgroundBlocks(ctx.WallsBlocks, Walls)
    ]);
  }
});