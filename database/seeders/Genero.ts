import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Genero from 'App/Models/Genero'

export default class extends BaseSeeder {
  public async run () {
    await Genero.createMany([
      {
        nombre: 'accion', 
        descripcion: '¿Buscas emoción y adrenalina? Las películas de acción en pelisPeda son perfectas para los amantes de la velocidad, la lucha y la intriga. Con secuencias impresionantes y héroes llenos de valentía, estas películas son ideales para un público que busca entretenimiento lleno de energía y emoción. Perfectas para aquellos que disfrutan de la intensidad y la acción sin límites. ¡Prepárate para vivir emocionantes aventuras!'
      },
      {
        nombre: 'comedia',
        descripcion: 'Si lo que necesitas es un buen rato de risas, las películas de comedia en pelisPeda son la elección acertada. Desde comedias clásicas hasta las más recientes, estas películas te garantizan diversión y momentos hilarantes. ¿Necesitas una buena risa? Las películas de comedia en pelisPeda son perfectas para aquellos que buscan diversión y momentos hilarantes. Ideal para disfrutar en familia o con amigos.'
      },
      {
        nombre: 'drama', 
        descripcion: 'Para aquellos que buscan historias con profundidad emocional y actuaciones impactantes, las películas de drama en pelisPeda ofrecen narrativas conmovedoras que te harán reflexionar. Prepárate para sentir una amplia gama de emociones. Si buscas historias conmovedoras y actuaciones impactantes, las películas de drama en pelisPeda son ideales para aquellos que deseen reflexionar sobre la gama completa de emociones. Una elección emocionalmente rica para diversos públicos.'},
      {
        nombre: 'terror', 
        descripcion: 'Si buscas emociones fuertes y adrenalina, las películas de terror en pelisPeda son la elección perfecta. Prepárate para sumergirte en historias escalofriantes y experimentar el suspenso en cada escena. ¡Una experiencia espeluznante te espera!, ¿Listo para emociones fuertes? Las películas de terror en pelisPeda son ideales para aquellos que buscan suspenso y adrenalina. Perfectas para amantes de la intriga y emociones intensas.'
      },
      {
        nombre: 'ciencia Ficcion', 
        descripcion: 'Explora mundos futuristas y tecnologías sorprendentes con las películas de ciencia ficción en pelisPeda. Estas producciones te transportarán a universos alternativos y desafiarán tu imaginación con tramas fascinantes y efectos visuales asombrosos. ,Explora futuros fascinantes con las películas de ciencia ficción en pelisPeda. Diseñadas para amantes de la tecnología y mundos alternativos, ideales para quienes disfrutan de la imaginación sin límites.'
      }
    ])
  }
}
