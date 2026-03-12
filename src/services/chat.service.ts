import { injectable, inject, delay } from 'tsyringe';
//import { ChatRepository } from '@repositories/chat.repository';
import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '@config';
import { SystemService } from '@services/system.service';

@injectable()
export class ChatService {
  //constructor(@inject(ChatRepository) private chatRepo: ChatRepository) {}
  constructor(@inject(delay(() => SystemService)) private systemService: SystemService){}

  private client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    public async processUserMessage(userId: string, message: string, contents: any[]) {
      
    const configx:any = await this.systemService.getConfiguration();
    //console.log('config', config);
    const config = configx[0];

    var instructions = `You are talking to John.`
        if (config.instructions) instructions += config.instructions;  
        if (config.abc_for_urges) instructions += config.abc_for_urges;
        if (config.behavior_cost_benefit) instructions += config.behavior_cost_benefit;
        if (config.change_plan) instructions += config.change_plan;
        if (config.hierarchy_of_values) instructions += config.hierarchy_of_values;
        if (config.disputing_unhelpful_beliefs) instructions += config.disputing_unhelpful_beliefs;
        if (config.explore_new_pursuits_and_passions) instructions += config.explore_new_pursuits_and_passions;
        if (config.five_questions_to_get_what_you_want) instructions += config.five_questions_to_get_what_you_want;
        if (config.goal_setting) instructions += config.goal_setting;
        if (config.life_balance_wheel) instructions += config.life_balance_wheel;
        if (config.personify_and_disarm) instructions += config.personify_and_disarm;
        if (config.practice_self_compassion) instructions += config.practice_self_compassion;
        if (config.put_dents_in_urges) instructions += config.put_dents_in_urges;
        if (config.setting_healthy_boundaries) instructions += config.setting_healthy_boundaries;
        if (config.urge_log) instructions += config. urge_log;
      ;
      
     //var instructions = 'say hello';

      console.log('instructions ------', instructions);
      
    const response = await this.client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        // In the new SDK, it is an explicit config field
        systemInstruction: instructions,
        temperature: 0.8,
      },
    });

    return response.text;
  }


}
