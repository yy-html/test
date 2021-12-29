/** "Implementor" 实现化 */
interface DrawingAPI{    
  public void drawCircle(double x, double y, double radius);
}
/** "ConcreteImplementor" 具体实现化 1/2 */
class DrawingAPI1 implements DrawingAPI{   
  public void drawCircle(double x, double y, double radius)    {        
    System.out.printf("API1.circle at %f:%f radius %f\n", x, y, radius);   
  }
}
/** "ConcreteImplementor" 具体实现化 2/2 */
class DrawingAPI2 implements DrawingAPI{   
  public void drawCircle(double x, double y, double radius)    {         
    System.out.printf("API2.circle at %f:%f radius %f\n", x, y, radius);   
  }
}
/** "Abstraction" 抽象化 */ 
interface Shape{   
  public void draw();
}
/** "Refined Abstraction" 修正抽象化 */
class CircleShape implements Shape{   
  private double x, y, radius;   
  private DrawingAPI drawingAPI;   
  public CircleShape(double x, double y, double radius, DrawingAPI drawingAPI)   {       
    this.x = x;  
    this.y = y;  
    this.radius = radius;        
    this.drawingAPI = drawingAPI;   
  }   // low-level i.e. Implementation specific   
  public void draw()   {        
    drawingAPI.drawCircle(x, y, radius);  
  }      // high-level i.e. Abstraction specific   
  public void resizeByPercentage(double pct)   {        
    radius *= pct;   
  }
}
/** "Client" */
class BridgePattern {
  public static void main(String[] args)   {
    Shape[] shapes = new Shape[2];       
    shapes[0] = new CircleShape(1, 2, 3, new DrawingAPI1());       
    shapes[1] = new CircleShape(5, 7, 11, new DrawingAPI2());       
    for (Shape shape : shapes)       {           
      shape.resizeByPercentage(2.5);           
      shape.draw();       
    }   
  }
}
